import { Controller, Get, Post, Body, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankDto } from './dto/rank.dto';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}
  
  @Get('load')
  load(@Headers('secretcode') secretCode: string) {
    if(secretCode) {
      return this.rankService.load(secretCode);
    } else {
      throw new HttpException(
        'Insufficient parameters',
        HttpStatus.BAD_REQUEST);
    }
  }
  
  @Post('reg')
  create(@Body() rank: RankDto) {
    if(rank.nickname !== '' 
    && typeof rank.score === 'number' 
    && typeof rank.stage === 'number'
    && typeof rank.subcha === 'number') {
      return this.rankService.create(rank);
    } else {
      throw new HttpException(
        'Insufficient parameters',
        HttpStatus.BAD_REQUEST);
    }
    
  }

}
