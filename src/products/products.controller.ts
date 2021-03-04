import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(
        private productsService: ProductsService
    ) {}

    @Get()
    getProducts() {
        return this.productsService.findAll()
    }

    @Get('/:id')
    getProductById(
        @Param('id', new ParseUUIDPipe) id: string,
    ) {
        return this.productsService.findById(id)
    }

    // For debug purposes
    @Get('/:id/refresh')
    refreshPrice(
        @Param('id') id: string
    ) {
        return this.productsService.refreshPrice(id)
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
