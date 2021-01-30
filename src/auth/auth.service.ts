import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable() 
export class AuthService {
  constructor (
    private jwtService: JwtService
  ) {}

  async validateUser(user: any) {
    const payload = { memo: 'Into The Forest!'}
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}