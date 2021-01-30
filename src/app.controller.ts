import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
// import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private authService: AuthService
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards()
  // @Post('/auth')
  // async validateUser(@Request() req) {
  //   return this.authService.validateUser(req)
  // }
}
