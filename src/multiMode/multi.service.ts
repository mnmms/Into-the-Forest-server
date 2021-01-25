import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { v4 as uuid } from 'uuid';

@Injectable()
export class MultiService {

  constructor(
    
  ) {
  
  }

  async create(hostId: string, data: any): Promise<any> {
    const newRoomId = uuid();

    const newRoom: any = {
      id: newRoomId,
      hostId: hostId,
    };

    try {
      // await this.redisCacheService.setToGroup(GROUP.GAME, newRoomId, newRoom);
      // await this.redisCacheService.setToGroup(GROUP.HOST_GAME, hostId, newRoomId);
      return this.response(null, newRoom);
    } catch (error) {
      return this.response(error, null);
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
