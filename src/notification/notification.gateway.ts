import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { jwtPayload } from '../interface/jwt-payload.interface';
import { NotificationService } from './notification.service';
import { forwardRef, Inject } from '@nestjs/common';
@WebSocketGateway(3002,{
  cors:'*',
})
export class NotificationGateway implements OnGatewayConnection {

 constructor(
    private readonly jwtService: JwtService,
    // Use forwardRef to avoid circular dependency errors
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @WebSocketServer()
  server:Server

  afterInit(server: Server) {
    console.log("server initialized") 
  }

  async handleConnection(client:Socket){
    try {
      
      console.log('client connected',client.id)
      const token = client.handshake.query.token as string;
      
      if(!token){
        throw new Error('No Token provided')
      }
      
      const decoded = await this.jwtService.verifyAsync<jwtPayload>(token)
      
      client.join(`user-${decoded.userId}`)
      
      const count = await this.handleNotificationCount(decoded.userId)
      this.server.to(`user-${decoded.userId}`).emit('notification-count',count)
    } catch (error) {
      console.error('Authentication error'+error.message)
      client.disconnect()
    }
  }

  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleNotificationCount(userId:string){
    return this.notificationService.countNotifications(userId)
  }

  sendToUser(userId:string,event:string,payload:any){
    this.server.to(`user-${userId}`).emit(event,payload)
  }
}
