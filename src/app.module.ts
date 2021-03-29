import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from './products/products.module';
import { PriceLogsModule } from './price-logs/price-logs.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    ProductsModule,
    PriceLogsModule,
  ],
})
export class AppModule { }
