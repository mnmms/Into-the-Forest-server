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

@WebSocketGateway()
export class MultiGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MultiGateway');

  @WebSocketServer() public server: Server;

  constructor (){}

  @SubscribeMessage('create room')
  async createGame(client: Socket, request) {
    const newRoomId = uuid();
    // const { error, payload } = await this.multiService.create(client.id, data);

    // if (error) return this.throwMessage(client, error);

    // const newRoom: any = payload;

    //client.join(newRoom.id);
    let data = this.extractRequest(request)
    console.log(data.cb)
    console.log(newRoomId)
    // console.log(cb)
    data.cb(newRoomId)
    // client.emit('create room', newRoom);
  }

  extractRequest (req: any): { data: any, cb?: Function } {
    if (Array.isArray(req)) {
      const [data, cb] = req
      return { data, cb }
    } else {
      return { data: req, cb: () => {} }
    }
  }

  // @SubscribeMessage('hello!')
  // handleEvent(client: Socket, payload: string): any {
  //   //return 'data'
  //  // console.log('sent!')
  //   //this.logger.log(`${payload}`)
  //   console.log(`hello from ${client.id}`);
  //   this.server.emit('msgToClient', 'please');
  // }

  // @SubscribeMessage('identity')
  //   async identity(@MessageBody() data: number): Promise<number> {
  //     return data;
  //   }

    afterInit(server: Server) {
      this.logger.log('Init');
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`)
    }

    private throwMessage(client: Socket, message: string): void {
      client.emit('alert', message);
    }
}
