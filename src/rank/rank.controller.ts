import { Controller, Get, Post, Req, Body, HttpCode } from '@nestjs/common';

import { RankService } from './rank.service';
import { RankDto } from './dto/rank.dto';
import { SecretCodeDto } from './dto/secretCode.dto'

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('load')
  load(@Body() secretCode: SecretCodeDto) {
    return this.rankService.load(secretCode)
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
