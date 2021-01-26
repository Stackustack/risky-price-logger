import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) {}

    @Get()
    getProduct() {
        return this.productsService.findAll()
    }

    @Delete('/:uuid')
    deleteProductById(
        @Param('uuid') uuid: string 
    ) {
        return this.productsService.deleteProduct(uuid)
    }

    @Post()
    watchProduct(
        @Body(ValidationPipe) createProductDto: CreateProductDto
    ) {        
        return this.productsService.watchProduct(createProductDto)
    }
}
