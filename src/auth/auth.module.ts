import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.stragegy'
// import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import crypto from 'crypto'

const key = crypto.randomBytes(3).toString("hex")

@Module({
  imports: [
    JwtModule.register({
      secret: key,
      signOptions: { expiresIn: '2 days'}
    })
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})

export class AuthModule{}