import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) {}

    @Get()
    getProduct() {
        // #TODO: GET /items
    }

    @Post()
    watchProduct(
        @Body(ValidationPipe) createProductDto: CreateProductDto
    ) {        
        return this.productsService.watchProduct(createProductDto)
    }
}
