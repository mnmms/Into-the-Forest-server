import { Controller, HttpCode, Post } from '@nestjs/common';
import { RecordService } from './record.service'

@Controller('record')
export class RecordController {
  constructor(private recordServie: RecordService) {}

  @Post('reg')
  @HttpCode(201)
  create(record) {
    return this.recordServie.create(record)
  }

  @Post('load')
  @HttpCode(200)
  findOne(record) {
    return this.recordServie.findOne(record)
  }
}
