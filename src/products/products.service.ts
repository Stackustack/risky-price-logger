import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { PriceLogsService } from './../price-logs/price-logs.service'
import { ProductSelectors } from './statics/product.selectors';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository,
        private priceLogService: PriceLogsService
    ) {}

    async findAll() {
        return this.productRepository.findAll()
    }

    async findById(id) {
        return this.productRepository.findById(id)
    }

    async watchProduct(createProductDto: CreateProductDto): Promise<{
        // url: string,
        // name: string,
        // pictureUrl: string,
        // id: string,
    }> {
        const { url } = createProductDto 
        const { price, pictureUrl } = await this.fetchPriceAndPicture(url)
        const productName = this.getReadableName(url)
        const product = await this.productRepository.add(url, productName, pictureUrl)
        const priceLog = await this.priceLogService.addNewLog(product, price)

        return ({
            product,
            priceLog 
        })
    }

    async deleteProduct(uuid: string) {
        return this.productRepository.deleteProduct(uuid)
    }

    private async fetchPriceAndPicture(url: string): Promise<{price: number, pictureUrl: string}> {
        const { PRICE, PICTURE_URL } = ProductSelectors
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const price = await page.evaluate((PRICE) => {
            return document
                .querySelector(PRICE)
                .textContent
        }, PRICE);

        const pictureUrl = await page.evaluate((PICTURE_URL) => {
            return document
                .querySelector(PICTURE_URL)
                .getAttribute('src')
        }, PICTURE_URL)

        await browser.close();

        const obj = {
            price,
            pictureUrl
        }

        return obj
    }

    getReadableName(url: string): string {
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        } 

        const pathWithoutDashes = url.slice(url.lastIndexOf('/') + 1)
            .replace(/-/g, ' ')
        const productName = pathWithoutDashes.charAt(0).toUpperCase() + pathWithoutDashes.slice(1)

        return productName
    }
}
