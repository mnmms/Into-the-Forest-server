import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import { config } from 'aws-sdk';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://intotheforest.space", 
      "https://intotheforest1.space", 
      "https://intotheforest2.space", 
      "https://intotheforest4.space", 
      "https://www.intotheforest.space", 
      "https://www.intotheforest1.space", 
      "https://www.intotheforest2.space", 
      "https://www.intotheforest4.space",], 
    methods: ["GET", "POST", "OPTION"],
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
