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

const rooms = {};
// const members = {};
const isRoomFull = room => room.memberList.length >= room.maxNum;

@WebSocketGateway()
export class MultiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MultiGateway');

  @WebSocketServer() public server: Server;

  constructor (private multiService: MultiService){}

  @SubscribeMessage('create room')
  async createRoom(client: Socket, roomData): Promise<void>{
    const { roomId, error } = await this.multiService.create(client.id, roomData);
    if(error) return error
    client.join(roomId)
    return roomId
    
  }

  @SubscribeMessage('join room') //룸으로 룸안에 룸 id로 넣기
  async joinRoom(client: Socket, data) {
    const { roomCode, nickName } = data;

    if (!(roomCode in rooms)) return 'not exist';
    if (isRoomFull(rooms[roomCode])) return 'room full';
      const id = rooms[roomCode].roomId;
      const memberList = rooms[roomCode].memberList;
      const newMember = { ...data, clientId: client.id };

      client.join(id)
      memberList.push(newMember);
  
      //client.to(roomCode).emit('member joined', { newMember })
      //객체 키 roomId 로 보내기 
      return id
  }

  // @SubscribeMessage('leave room')
  // async leaveRoom(client: Socket, data) {
  //   //data로 room code 가 들어온다는 가정 하에 
  //   const { roomCode } = data
  //   if (roomCode in rooms) {
  //     client.leave(roomCode)
  //     let memberList = rooms[roomCode].memberList;
  //     let index = memberList.indexOf(client.id)
  //     memberList.splice(index, 1);

  //     if(memberList.length === 0) {

  //     }
  //   }

  //     const id = rooms[roomCode].roomId;
  //     const memberList = rooms[roomCode].memberList;
  //     const newMember = { ...data, clientId: client.id };

  //     client.join(id)
  //     memberList.push(newMember);

  //     client.to(roomCode).emit('member joined', { newMember })
  //     return id
  // }

  // socket.on(EVENT.LEAVE_ROOM, ({ roomId }) => {
  //   if (roomId in rooms) {
  //     socket.leave(roomId);
  //     delete members[socket.id];

  //     _.remove(rooms[roomId].memberList, member => member.socketId === socket.id);

  //     if (_.isEmpty(rooms[roomId].memberList)) {
  //       delete rooms[roomId];
  //     } else {
  //       socket.to(roomId).emit(EVENT.MEMBER_LEAVED, { socketId: socket.id });
  //     }

  //     socket.broadcast.emit(EVENT.ROOM_LIST, { rooms: _.values(rooms) });
  //     io.to(roomId).emit(EVENT.RESET_GAME);
  //   }
  // });


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
