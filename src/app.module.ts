import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankModule } from './rank/rank.module';
import { Rank } from './rank/rank.model'
import { RecordModule } from './record/record.module'
import { Record } from './record/record.model'
import { HealthCheckModule } from './healthCheck/healthCheck.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        timezone: '+09:00',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        models: [Rank, Record],
      }),
      inject: [ConfigService]
    }),
    RankModule,
    RecordModule,
    HealthCheckModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
