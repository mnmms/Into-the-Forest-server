import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_JWT'),
        signOptions: { expiresIn: '1 days'}
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule]
})

export class AuthModule{}