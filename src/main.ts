import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config'
import { config } from 'aws-sdk';
//const fs = require('fs');

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('../../auth/key.pem'),
  //   cert: fs.readFileSync('../../auth/cert.pem'),
  // };
  //아래 줄에 추가해야함 {httpsOptions}
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: [
      "https://localhost:3000", 
      "https://intotheforest.space", 
      "https://intotheforest1.space", 
      "https://intotheforest2.space", 
      "https://intotheforest4.space"], 
    methods: ["GET", "POST", "OPTION"],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION')
  })

  await app.listen(4000);
}
bootstrap();
