import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable() 
export class AuthService {
  constructor (
    private jwtService: JwtService
  ) {}

  async validateUser() {
    const payload = { key: 'mongmong' };
    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async validate(data: any) {
    if(data.key === 'mongmong') {
      return { message: 'ok'}
    }
  }
}