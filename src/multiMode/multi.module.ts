import { Module } from '@nestjs/common';
import { MultiGateway } from './multi.gateway';
//mport { MultiService } from './multi.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MultiGateway]
})
export class MultiModule {}
