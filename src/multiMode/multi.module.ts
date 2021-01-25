import { Module } from '@nestjs/common';
import { MultiGateway } from './multi.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [MultiGateway]
})
export class MultiModule {}
