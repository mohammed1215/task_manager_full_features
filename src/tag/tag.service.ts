import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { WorkspaceMemberService } from '../workspace-member/workspace-member.service';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
        private readonly workspaceService: WorkspaceMemberService,
    ) {}
    async create(workspaceId: string, createTagDto: CreateTagDto) {
        // get counts of tags
        const tagCount = await this.tagRepo.count({
            where: {
                workspace: { id: workspaceId },
            },
        });

        //check if tag count reached 50
        if (tagCount >= 50) {
            throw new BadRequestException(
                'Maximum 50 tags per workspace reached',
            );
        }
        try {
            //create tag
            const tag = this.tagRepo.create({
                ...createTagDto,
                workspace: { id: workspaceId },
            });

            //save it and return
            return await this.tagRepo.save(tag);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                const customError = error as QueryFailedError & {
                    constraint?: string;
                };
                if (customError.constraint === 'unique_tag_per_workspace') {
                    throw new ConflictException(
                        'Tag already exists in this workspace',
                    );
                }
            }
            throw error;
        }
    }

    async findAll(workspaceId: string, userId: string) {
        // check if he is at the workspace or not
        await this.workspaceService.findOne(workspaceId, userId);
        return this.tagRepo.find({
            where: {
                workspace: { id: workspaceId },
            },
            order: {
                name: 'ASC',
            },
        });
    }

    // findOne(id: number) {
    //   return `This action returns a #${id} tag`;
    // }

    async update(tagId: string, updateTagDto: UpdateTagDto) {
        const tag = await this.tagRepo.findOne({
            where: {
                id: tagId,
            },
        });

        return await this.tagRepo.save({ ...tag, ...updateTagDto });
    }

    async remove(tagId: string) {
        const tag = await this.tagRepo.delete({ id: tagId });
        if (!tag.affected) {
            throw new NotFoundException('tag not found');
        }
        return { message: 'tag has been deleted successfully' };
    }
}
