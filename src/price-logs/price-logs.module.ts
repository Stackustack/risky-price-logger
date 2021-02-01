import { Module } from '@nestjs/common';
import { PriceLogsService } from './price-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceLogRepository } from './price-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PriceLogRepository])
  ],
  providers: [PriceLogsService],
  exports: [PriceLogsService]
})
export class PriceLogsModule {}
