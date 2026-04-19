import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { TaskModule } from '../task/task.module';
import { NotificationListener } from './notification.listener';
import { AppModule } from '../app.module';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
    controllers: [NotificationController],
    providers: [NotificationService, NotificationGateway, NotificationListener],
    imports: [
        TypeOrmModule.forFeature([Notification]),
        forwardRef(() => TaskModule),
        forwardRef(() => AppModule),
        UserModule,
        forwardRef(() => BoardModule),
        forwardRef(() => WorkspaceModule),
    ],
    exports: [NotificationListener, NotificationGateway],
})
export class NotificationModule {}
