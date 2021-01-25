import { 
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody
 } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io'

@WebSocketGateway()
export class MultiGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('MultiGateway');

  @SubscribeMessage('hello!')
  handleEvent(client: Socket, payload: string): any {
    //return 'data'
   // console.log('sent!')
    //this.logger.log(`${payload}`)
    console.log(`hello from ${client.id}`);
    this.server.emit('msgToClient', 'please');
  }

  @SubscribeMessage('identity')
    async identity(@MessageBody() data: number): Promise<number> {
      return data;
    }
  
  @SubscribeMessage('connect')
  handleConnect(client: Socket, payload: string): any {
    console.log(`connect`);
    //this.server.emit('msgToClient', 'please');
    }

  // afterInit(server: Server) {
  //   this.logger.log('Init');
  // }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }
}

// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   WsResponse,
//     OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// // import { from, Observable } from 'rxjs';
// // import { map } from 'rxjs/operators';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
// export class MultiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   // @SubscribeMessage('events')
//   // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
//   //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
//   // }

//   @SubscribeMessage('identity')
//   async identity(@MessageBody() data: number): Promise<number> {
//     return data;
//   }

//   @SubscribeMessage('hello!')
//   handleEvent(client: Socket, payload: string): any {
//     //return 'data'
//    // console.log('sent!')
//     //this.logger.log(`${payload}`)
//     console.log(`hello from ${client.id}`);
//     //this.server.emit('msgToClient', 'please');
//   }
// }



