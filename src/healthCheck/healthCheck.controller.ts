import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('healthCheck')
export class HealthCheckController {
  constructor() {}

  @Get()
  @HttpCode(200)
  get(){
    return 'ok'
  }
}
