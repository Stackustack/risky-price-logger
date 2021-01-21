import { Module } from '@nestjs/common';
import { ProductsModule } from './items/products.module';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
