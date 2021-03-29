import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { PriceLogsModule } from 'src/price-logs/price-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository]),
    PriceLogsModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule { }
