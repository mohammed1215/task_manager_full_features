import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Not, QueryRunner, Repository } from 'typeorm';
import { WorkspaceMemberService } from '../workspace-member/workspace-member.service';
import { ColumnService } from '../column/column.service';
import { DataSource } from 'typeorm';
import { ColumnEntity } from '../column/entities/column.entity';
import { BoardMember } from './entities/board-member.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { BoardRoles, Visibility } from '../enum/enum';
@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board) private readonly boardRepo: Repository<Board>,
        private readonly workspaceMemberService: WorkspaceMemberService,
        @Inject(forwardRef(() => ColumnService))
        private readonly columnService: ColumnService,
        private readonly dataSource: DataSource,
        @InjectRepository(BoardMember)
        private readonly boardMemberRepo: Repository<BoardMember>,
    ) {}
    async create(
        userId: string,
        workspaceId: string,
        createBoardDto: CreateBoardDto,
        queryRunnerPass?: QueryRunner,
    ) {
        //create query runner
        const queryRunner =
            queryRunnerPass || this.dataSource.createQueryRunner();
        if (!queryRunnerPass) {
            await queryRunner.connect();
            await queryRunner.startTransaction();
        }

        try {
            //check if user in workspace
            const member = await this.workspaceMemberService.findOneWithManager(
                workspaceId,
                userId,
                queryRunner.manager,
            );

            //create board
            const board = queryRunner.manager.create(Board, {
                ...createBoardDto,
                createdBy: { id: userId },
                workspace: { id: workspaceId },
            });

            //save in database
            await queryRunner.manager.save(board);

            //create 3 columns after saving to get the board id
            const columns = queryRunner.manager.create(ColumnEntity, [
                { name: 'To Do', position: 0, board: { id: board.id } },
                { name: 'In Progress', position: 1, board: { id: board.id } },
                { name: 'Done', position: 2, board: { id: board.id } },
            ]);
            await queryRunner.manager.save(columns);

            //create board members after saving into the database because the boardMember is dependent on board.id and with queryRunner the values is first undefined so you need to save first to get values
            const boardMember = queryRunner.manager.create(BoardMember, {
                board: { id: board.id },
                role: BoardRoles.ADMIN,
                invitedBy: { id: userId },
                user: { id: userId },
            });

            //get all workspace members that are not in the created board and add them to the board if it was PUBLIC
            if (createBoardDto.visibility === Visibility.PUBLIC) {
                const workspaceMembers = await queryRunner.manager.find(
                    WorkspaceMember,
                    {
                        where: {
                            workspace: { id: workspaceId },
                            user: { id: Not(userId) },
                        },
                        relations: ['user'],
                    },
                );
                if (workspaceMembers.length > 0) {
                    const createdBoardMembers = workspaceMembers.map(
                        (member) => ({
                            role: BoardRoles.MEMBER,
                            board: { id: board.id },
                            invitedBy: null,
                            user: { id: member.user.id },
                        }),
                    );

                    const boardMembersEntities = queryRunner.manager.create(
                        BoardMember,
                        createdBoardMembers,
                    );
                    await queryRunner.manager.save(
                        BoardMember,
                        boardMembersEntities,
                    );
                }
            }

            //save in database
            await queryRunner.manager.save(boardMember);

            // commit transaction
            if (!queryRunnerPass) {
                await queryRunner.commitTransaction();
            }
            return {
                message: 'board created successfully',
                board: {
                    ...board,
                    columns,
                },
            };
        } catch (error) {
            if (!queryRunnerPass) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        } finally {
            if (!queryRunnerPass) {
                await queryRunner.release();
            }
        }
    }

    // async createWithManager(
    //   manager: EntityManager,
    //   userId: string,
    //   workspaceId: string,
    //   createBoardDto: CreateBoardDto,
    // ) {}

    async archiveBoard(userId: string, boardId: string) {
        const user = await this.checkAdminRoleOfBoardMemberUser(
            userId,
            boardId,
            'Not Allowed Privilages: Admins are the only ones that can archive the board',
        );

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const board = await this.findOneBoard(boardId);
        if (board.isArchived) {
            throw new BadRequestException('Board is already archived');
        }

        try {
            const updateResult = await queryRunner.manager.update(
                Board,
                { id: boardId },
                { isArchived: true, archivedAt: new Date() },
            );
            const deletedResult = await queryRunner.manager.softDelete(Board, {
                id: boardId,
            });

            if (!updateResult.affected)
                throw new NotFoundException('board not found');
            if (!deletedResult.affected)
                throw new NotFoundException('board not found');

            await queryRunner.commitTransaction();
            return { message: 'board has been archived' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async restoreBoard(userId: string, boardId: string) {
        const user = await this.checkAdminRoleOfBoardMemberUser(
            userId,
            boardId,
            'Not Allowed Privilages: Admins are the only ones that can archive the board',
        );
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const board = await this.findOneBoard(boardId);

        // check if board date of archivment didn't exceed 30 days
        if (!board.archivedAt) {
            throw new BadRequestException('board is not archived');
        }
        const exceededDate =
            new Date(board.archivedAt).getTime() + 30 * 24 * 60 * 60 * 1000;
        if (exceededDate && new Date().getTime() > exceededDate) {
            throw new BadRequestException('30 days has been exceeded');
        }
        try {
            const restoreResult = await queryRunner.manager.restore(Board, {
                id: boardId,
            });
            const updateResult = await queryRunner.manager.update(
                Board,
                { id: boardId },
                { isArchived: false, archivedAt: null },
            );

            if (!updateResult.affected)
                throw new NotFoundException('board not found');
            if (!restoreResult.affected)
                throw new NotFoundException('board not found');

            await queryRunner.commitTransaction();
            return { message: 'board has been restored successfully' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    findAll(
        userId: string,
        workspaceId: string,
        page: number,
        limit: number,
        filter: 'archived' | 'active' | 'all',
    ) {
        limit = Math.max(1, limit);
        page = Math.max(1, page);
        const archivedFilter =
            filter === 'active'
                ? false
                : filter === 'archived'
                  ? true
                  : undefined;

        const baseCondition = {
            workspace: { id: workspaceId },
            ...(archivedFilter !== undefined && { isArchived: archivedFilter }),
        };

        return this.boardRepo.find({
            where: [
                {
                    visibility: Visibility.PRIVATE,
                    members: { user: { id: userId } },
                    ...baseCondition,
                },
                {
                    visibility: Visibility.PUBLIC,
                    ...baseCondition,
                },
                {
                    visibility: Visibility.WORKSPACE,
                    ...baseCondition,
                },
            ],
            take: limit,
            skip: (page - 1) * limit,
        });
    }

    async findOneBoard(boardId: string) {
        const board = await this.boardRepo.findOne({
            where: { id: boardId },
            withDeleted: true,
            relations: ['createdBy', 'workspace'],
        });
        if (!board) throw new NotFoundException('board not found');
        return board;
    }

    async update(
        userId: string,
        boardId: string,
        updateBoardDto: UpdateBoardDto,
    ) {
        const user = await this.checkAdminRoleOfBoardMemberUser(
            userId,
            boardId,
            'Not Allowed Privilages: Admins are the only ones that can update the board',
        );

        const result = await this.boardRepo.update(
            { id: boardId },
            { ...updateBoardDto },
        );
        if (!result.affected) throw new NotFoundException('board not found');
        return { message: 'board has been updated succesfully' };
    }

    async remove(userId: string, boardId: string, confirmation: string) {
        //confirmation
        // find board
        const board = await this.findOneBoard(boardId);
        if (board.name !== confirmation) {
            throw new BadRequestException('should write board name correctly');
        }

        if (board.createdBy.id !== userId && board.archivedAt) {
            throw new ForbiddenException(
                'owners of the board are the ones that can delete archived boards',
            );
        }

        const member = await this.findOneBoardMember(userId, boardId);
        if (member.role !== BoardRoles.ADMIN) {
            throw new ForbiddenException(
                'Not Allowed Privilages: Admins are the only ones that can delete the board',
            );
        }

        // delete the board
        const result = await this.boardRepo.delete({ id: boardId });
        if (!result.affected) throw new NotFoundException('board not found');

        return { message: 'board has been deleted permanently' };
    }

    async findOneBoardMember(userId: string, boardId: string) {
        const member = await this.boardMemberRepo.findOne({
            where: { board: { id: boardId }, user: { id: userId } },
            withDeleted: true,
        });
        if (!member)
            throw new NotFoundException('member does not exist on board');
        return member;
    }

    async checkAdminRoleOfBoardMemberUser(
        userId: string,
        boardId: string,
        message: string,
    ) {
        const user = await this.findOneBoardMember(userId, boardId);
        if (user.role !== BoardRoles.ADMIN) {
            throw new ForbiddenException(message);
        }
        return user;
    }

    async userHasAccess(userId: string, boardId: string): Promise<boolean> {
        const member = await this.boardMemberRepo.findOne({
            where: { board: { id: boardId }, user: { id: userId } },
            withDeleted: true,
        });
        if (!member) false;
        return true;
    }
}
