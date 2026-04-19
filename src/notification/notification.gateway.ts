import { JwtService } from '@nestjs/jwt';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { jwtPayload } from '../interface/jwt-payload.interface';
import { NotificationService } from './notification.service';
import { forwardRef, Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from '../board/board.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { WorkspaceService } from '../workspace/workspace.service';
@WebSocketGateway(3002, {
    cors: '*',
})
export class NotificationGateway implements OnGatewayConnection {
    constructor(
        private readonly jwtService: JwtService,
        // Use forwardRef to avoid circular dependency errors
        @Inject(forwardRef(() => NotificationService))
        private readonly notificationService: NotificationService,
        private readonly boardService: BoardService,
        private readonly workspaceService: WorkspaceService,
    ) {}

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('server initialized');
    }

    async handleConnection(client: Socket) {
        try {
            console.log('client connected', client.id);
            const token = client.handshake.query.token as string;

            if (!token) {
                throw new Error('No Token provided');
            }

            const decoded =
                await this.jwtService.verifyAsync<jwtPayload>(token);

            client.join(`user-${decoded.userId}`);
            console.log(client.rooms);
            const count = await this.handleNotificationCount(decoded.userId);
            this.server
                .to(`user-${decoded.userId}`)
                .emit('notification-count', count);
            client.handshake['user'] = decoded;
        } catch (error) {
            console.error('Authentication error' + error.message);
            client.disconnect();
            console.log(client.disconnected);
            // throw error;
        }
    }

    handleMessage(client: any, payload: any): string {
        return 'Hello world!';
    }

    handleNotificationCount(userId: string) {
        return this.notificationService.countNotifications(userId);
    }

    sendToUser(userId: string, event: string, payload?: any) {
        this.server.to(`user-${userId}`).emit(event, payload);
    }

    // @UseGuards()
    @SubscribeMessage('join-board-room')
    async joinBoardRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { boardId: string },
    ) {
        // don't forget to edit the JSON.parse with the data
        console.log('Received data:', data);
        const boardId = data.boardId;
        const userId = client.handshake['user'].userId;
        const hasAccess = await this.boardService.userHasAccess(
            userId,
            boardId,
        );

        if (!hasAccess) {
            client.emit('error', {
                message: 'You do not have access to this board',
            });
            return;
        }

        const roomName = `board:${boardId}`;
        await client.join(roomName);
        console.log('rooms client are in currently', client.rooms);
        // client.emit('joined-room', { room: roomName, status: 'success' });
        // client.to(roomName).emit('user-entered-board', { userId });
    }
    @SubscribeMessage('leave-workspace-room')
    async leaveWorkspaceRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { workspaceId: string },
    ) {
        // don't forget to edit the JSON.parse with the data
        console.log('Received data:', data);
        const workspaceId = data.workspaceId;
        const userId = client.handshake['user'].userId;
        const hasAccess = await this.workspaceService.userHasAccess(
            userId,
            workspaceId,
        );

        if (!hasAccess) {
            client.emit('error', {
                message: 'You do not have access to this board',
            });
            return;
        }

        const roomName = `workspace:${workspaceId}`;
        await client.leave(roomName);
        console.log('rooms client are in currently', client.rooms);
        // client.emit('joined-room', { room: roomName, status: 'success' });
        // client.to(roomName).emit('user-entered-board', { userId });
    }
    @SubscribeMessage('join-workspace-room')
    async joinWorkspaceRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { workspaceId: string },
    ) {
        // don't forget to edit the JSON.parse with the data
        console.log('Received data:', data);
        const workspaceId = data.workspaceId;
        const userId = client.handshake['user'].userId;
        const hasAccess = await this.workspaceService.userHasAccess(
            userId,
            workspaceId,
        );

        if (!hasAccess) {
            client.emit('error', {
                message: 'You do not have access to this board',
            });
            return;
        }

        const roomName = `workspace:${workspaceId}`;
        await client.join(roomName);
        console.log('rooms client are in currently', client.rooms);
        // client.emit('joined-room', { room: roomName, status: 'success' });
        // client.to(roomName).emit('user-entered-board', { userId });
    }

    sendToBoard(
        boardId: string,
        event: string,
        payload: CreateNotificationDto,
    ) {
        this.server.to(`board:${boardId}`).emit(event, payload);
    }

    sendToWorkspace(workspaceId: string, event: string, payload: any) {
        this.server.to(`workspace:${workspaceId}`).emit(event, payload);
    }
}
