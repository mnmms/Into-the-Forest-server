import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RankInt } from './interfaces/rank.interface';
import { SecretCodeInterface } from './interfaces/secretCode.interface'
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
  
  load(secretCodeInt: SecretCodeInterface) { 
    if(secretCodeInt.secretCode === this.SECRET_CODE) {
      return this.rank.findAll({
        limit: 10,
        order: [['score', 'DESC']]
      })
    } else {
      return {
        error: 'sorry'
      }
    }
  }

  create(rank: RankInt) {
    this.rank.create({
      nickname: rank.nickname,
      score: rank.score,
      stage: rank.stage,
      subcha: rank.subcha
    })
  }
}
