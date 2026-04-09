import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service.ts';
import { WorkspaceController } from './workspace.controller.ts';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity.ts';
import { WorkspaceMember } from '../workspace-member/entities/workspace-member.entity.ts';
import { UserModule } from '../user/user.module.ts';
import { AppModule } from '../app.module.ts';
import { Invitation } from './entities/invitation.entity.ts';
import { Activity } from '../activity/entities/activity.entity.ts';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports:[
  TypeOrmModule.forFeature([Workspace,WorkspaceMember,Invitation,Activity]),
  UserModule,
  forwardRef(()=>AppModule)
]
})
export class WorkspaceModule {}
