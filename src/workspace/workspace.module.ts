import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from 'src/workspace-member/entities/workspace-member.entity';
import { UserModule } from 'src/user/user.module';
import { AppModule } from 'src/app.module';
import { Invitation } from './entities/invitation.entity';
import { Activity } from 'src/activity/entities/activity.entity';

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
