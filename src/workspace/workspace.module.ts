import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity';
import { UserModule } from '../user/user.module';
import { AppModule } from '../app.module';
import { Invitation } from './entities/invitation.entity';
import { Activity } from '../activity/entities/activity.entity';
import { BoardModule } from '../board/board.module';

@Module({
    controllers: [WorkspaceController],
    providers: [WorkspaceService],
    imports: [
        TypeOrmModule.forFeature([
            Workspace,
            WorkspaceMember,
            Invitation,
            Activity,
        ]),
        UserModule,
        forwardRef(() => BoardModule),
        forwardRef(() => AppModule),
    ],
    exports: [WorkspaceService],
})
export class WorkspaceModule {}
