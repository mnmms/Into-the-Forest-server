import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RankInt } from './interfaces/rank.interface';
import { Rank } from './rank.model'

@Injectable()
export class RankService {
  readonly SECRET_CODE: string;

  constructor(
    @InjectModel(Rank)
    private rank: typeof Rank,
  ) {
    this.SECRET_CODE = 'shelter';
  }
  
  async load(secretCode: string) { 
    if(secretCode === this.SECRET_CODE) {
      return await this.rank.findAll({
        limit: 10,
        order: [['score', 'DESC']],
        attributes: { exclude: ['id', 'updatedAt']}
      })
    } else {
      throw new HttpException(
        'Rank with this secret code does not exist',
        HttpStatus.NOT_FOUND);
    }
  }

  async create(rank: RankInt) {
    const ranking = await this.rank.create({
      nickname: rank.nickname,
      score: rank.score,
      stage: rank.stage,
      subcha: rank.subcha
    })
    return await Object.assign({
      message: 'ok' });
  }
}
