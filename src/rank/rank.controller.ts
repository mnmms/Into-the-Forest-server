import { Controller, Get, Post, Body, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankDto } from './dto/rank.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Get('load')
  load() {
    return this.rankService.load();
  }
  
  @UseGuards(AuthGuard('jwt'))
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
