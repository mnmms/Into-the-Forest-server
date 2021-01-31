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
      return { clientId: client.id, roomId: roomId }
    }
  }

  @SubscribeMessage('join room')
  async joinRoom(client: Socket, userData: UserData): Promise<object> {
    console.log('4', userData)
    const { roomId, error } = await this.multiService.join(client.id, userData)

    if(error) {
      return { error: error }
    }
    console.log(roomId)
    if(roomId) {
      client.join(roomId)
      return { clientId: client.id, roomId: roomId }
    }
  }

  @SubscribeMessage('user joined')
  async alertUser(client: Socket, userData) {
    const { roomId, error, data } = await this.multiService.alert(client.id, userData);
    console.log('user joined', roomId)
    if(error) {
      return { error: error }
    }

    if(roomId) {
      this.server.to(roomId).emit('user joined', data ) //신규 멤버 입장 알림
    }
  }
  
  @SubscribeMessage('set profile')
  async setProfile(client: Socket, userData) {
    const { roomId, user } = await this.multiService.setProfile(client.id, userData)

    if(user) {
      this.server.to(roomId).emit('set profile', user ) 
    }
  }
  
  @SubscribeMessage('chat')
  async chat(client: Socket, chatData) {
    const { roomId } = await this.multiService.chat(chatData)

    if(roomId) {
      this.server.to(roomId).emit('chat', { chat: chatData, clientId: client.id })
    }
  }

  @SubscribeMessage('leave room') //나가기 버튼 눌렀을 때
  async leaveRoom(client: Socket, userData: UserData) {
    const { roomId, error } = await this.multiService.leave(client.id)

    if(error) {
      return { error: error }
    }

    if(roomId) {
      client.leave(roomId)
      this.server.to(roomId).emit('user leaved', { clientId : client.id }) //멤버 퇴장 알림
    }
  }

  @SubscribeMessage('sending signal')
  async sendSignal(client: Socket, data) {
    //roomCode 필요
    const { socketId, initiator, signal } = await this.multiService.send(client.id, data)
    this.server.to(socketId).emit('sending signal', { initiator, signal })
  }

  @SubscribeMessage('returning signal')
  async returnSignal(client: Socket, data) {
    //roomCode 필요
    const { socketId, returner, signal } = await this.multiService.return(client.id, data)
    this.server.to(socketId).emit('returning signal', { returner, signal })
  }

  @SubscribeMessage('send ready') 
  async sendReady(client: Socket, data) {
    const { response } = await this.multiService.sendReady(client.id, data)
    if(response.start) {
    this.server.to(response.socketId).emit('send ready', response)
    }
  }

  @SubscribeMessage('game start') 
  async gameStart(client: Socket, data) {
    const { response } = await this.multiService.gameStart(client.id, data)
    if(response.start) {
      this.server.to(response.roomId).emit('game start', response)
    }
  }

  @SubscribeMessage('send result') 
  async sendResult(client: Socket, gameResult) {
    const { response } = await this.multiService.sendResult(client.id, gameResult)
    if(response.userList) {
      this.server.to(response.roomId).emit('send result', response.userList)
    }
  }



  // socket.on(EVENT.SENDING_SIGNAL, ({ signal, receiver }) => {
  //   const initiator = members[socket.id];
  //   const { socketId } = receiver;  // 이 부분 룸 id 맞는지 확인 필요
  //   io.to(socketId).emit(EVENT.SENDING_SIGNAL, { initiator, signal });
  // });

  // socket.on(EVENT.RETURNING_SIGNAL, ({ signal, receiver }) => {
  //   const returner = members[socket.id];
  //   const { socketId } = receiver;
  //   io.to(socketId).emit(EVENT.RETURNING_SIGNAL, { returner, signal });
  // });


    async afterInit(server: Server) {
      this.logger.log('Init');
    }
  
    async handleDisconnect(client: Socket) { //브라우저 창에서 x 눌렀을 때
      this.logger.log(`Client disconnected: ${client.id}`);
      const { roomId, error } = await this.multiService.leave(client.id);

      if(error) {
        return { error: error }
      }

      if(roomId) {
        client.leave(roomId)
        this.server.to(roomId).emit('user leaved', { socketId : client.id }) //멤버 퇴장 알림
      }
    }
  
    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`)
    }
}
