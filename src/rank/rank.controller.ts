import { Controller, Get, Post, Req, Body, HttpCode, Headers } from '@nestjs/common';

import { RankService } from './rank.service';
import { RankDto } from './dto/rank.dto';
import { SecretCodeDto } from './dto/secretCode.dto'

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('load')
  load(@Headers() secretCode) {
    return this.rankService.load(secretCode.secretcode)
  }

  @Post('reg')
  @HttpCode(201)
  create(@Body() rankDto: RankDto ) {
    this.rankService.create(rankDto)
    return {
        message: 'ok'
    }
 
  }

}
