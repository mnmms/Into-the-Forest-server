import { Module } from '@nestjs/common';
import { MultiGateway } from './multi.gateway';
import { MultiService } from './multi.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MultiGateway, MultiService]
})
export class MultiModule {}
