import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

const rooms = {};

@Injectable()
export class MultiService {

  constructor(
    
  ) {
  
  }

  async create(hostId: string, data: any): Promise<any> {
    try {
      const { roomCode, maxNum } = data;
      console.log(data)
      if (!(roomCode in rooms)) new Error('not exist');  //룸코드 중복 검사 

      const roomId = uuid(); // 신규 방 id 생성
      const newRoom = { // 신규 방 생성 
        maxNum: maxNum, 
        roomId: roomId,
        memberList: [],
      }
      rooms[roomCode] = newRoom; //방 목록에 추가

      return { roomId: roomId };
    } catch (error) {
      return { error : error };
    }
  }

  // async setToGroup(group: string, key: string, value: any): Promise<any> {
  //   const parsedGroup = await this.get(group);

  //   if (!parsedGroup) {
  //     const newGroup = { [key]: value };
  //     await this.set(group, newGroup);
  //     return newGroup;
  //   }

  //   parsedGroup[key] = value;
  //   await this.set(group, parsedGroup);
  //   return parsedGroup;
  // }

  
  // async join(playerId: string, gameId: string): Promise<any> {
  //   try {
  //     // const game = await this.getGame(gameId);

  //     // if (!game) return this.response('not exist', null);

  //     const vacancy = game.playerList.find(player => !player.id);

  //     if (!vacancy) return this.response('full', null);

  //     vacancy.id = playerId;
  //     // await this.redisCacheService.setToGroup(GROUP.GAME, gameId, game);
  //     // await this.redisCacheService.setToGroup(GROUP.PLAYER_GAME, playerId, gameId);
  //     return this.response(null, game.playerList);
  //   } catch (error) {
  //     return this.response(error, null);
  //   }
  // }



  private response(error: null | string, payload: any): any {
    return { error, payload };
  }

}
