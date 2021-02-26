import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { PriceLogsModule } from './price-logs/price-logs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ProductsModule,
    PriceLogsModule
  ],
})
export class AppModule {}
