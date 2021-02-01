import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { PriceLogsModule } from './price-logs/price-logs.module';
import { PriceLogsService } from './price-logs/price-logs.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    PriceLogsModule
  ],
  // providers: [PriceLogsService],
})
export class AppModule {}
