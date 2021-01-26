import { 
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
 } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io'
import { MultiService } from './multi.service';
import { v4 as uuid } from 'uuid';

import { RoomData, UserData, ChatData } from './multi.interface'

const rooms = {};
// const members = {};

@WebSocketGateway()
export class MultiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MultiGateway');

  @WebSocketServer() public server: Server;

  constructor (private multiService: MultiService){}

  @SubscribeMessage('create room')
  async createRoom(client: Socket, roomData: RoomData): Promise<object> {
    const { roomId, error } = await this.multiService.create(client.id, roomData)

    if(error) {
      return { error: error }
    }

    if(roomId) {
      client.join(roomId)
      return { roomId: roomId }
    }
  }

  @SubscribeMessage('join room')
  async joinRoom(client: Socket, userData: UserData): Promise<object> {
    const { roomId, error, newMember } = await this.multiService.join(client.id, userData)

    if(error) {
      return { error: error }
    }

    if(roomId) {
      client.join(roomId)
      client.to(roomId).emit('member joined', { newMember }) //신규 멤버 입장 알림
      return { roomId: roomId }
    }
  }

  @SubscribeMessage('leave room')
  async leaveRoom(client: Socket, userData: UserData) {
    const { roomId, error } = await this.multiService.leave(client.id, userData)

    if(error) {
      return { error: error }
    }

    if(roomId) {
      client.leave(roomId)
      client.to(roomId).emit('member leaved', { clientId : client.id }) //신규 멤버 입장 알림
      return { roomId: roomId }
    }
  }
  
  @SubscribeMessage('chat')
  async chat(client: Socket, chatData: ChatData) {
    const { roomId, error, chat } = await this.multiService.chat(client.id, chatData)

    if(error) {
      return { error: error }
    }

    if(roomId) {
      client.to(roomId).emit('chat', { chat })
    }
  }

    afterInit(server: Server) {
      this.logger.log('Init');
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`)
    }
}
