import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankModule } from './rank/rank.module';
import { Rank } from './rank/rank.model'
import { RecordModule } from './record/record.module'
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: Joi.object({
        
      })
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        models: [Rank],
      }),
      inject: [ConfigService]
    }),
    RankModule,
    RecordModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
