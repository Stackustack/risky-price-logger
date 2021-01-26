import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository
    ) {}

    async findAll() {
        return this.productRepository.findAll()
    }

    async findById(id) {
        return this.productRepository.findById(id)
    }

    async watchProduct(createProductDto: CreateProductDto): Promise<{
        url: string,
        name: string,
        pictureUrl: string,
        id: string,
    }> {
        const { url } = createProductDto 
        const { price, pictureUrl } = await this.fetchPriceAndPicture(url)
        const productName = this.getReadableName(url)

        const product = await this.productRepository.add(url, productName, pictureUrl)
        // TODO 1: add product to DB (if its not there yet) - THIS MODULE, IN REPOSITORY
        //              productRepository.addProduct(url, name, picture)
        // TODO 2: add priceLog to DB
        //          in priceLog service add method to that
        //          this.addPriceLog(productId, price, timestamp)
        //              - this runs repository method to save that to DB


        return product
    }

    async deleteProduct(uuid: string) {
        return this.productRepository.deleteProduct(uuid)
    }

    private async fetchPriceAndPicture(url: string): Promise<{price: number, pictureUrl: string}> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const price = await page.evaluate(() => {
            return document
                .querySelector(".ty-product-block__price-actual .ty-price-update .ty-price bdi .ty-price-num:first-of-type")
                .textContent
        });

        const pictureUrl = await page.evaluate(() => {
            return document
                .querySelector('[class="owl-item active"]  img[class="ty-pict     cm-image"]')
                .getAttribute('src')
        })

        await browser.close();

        const obj = {
            price: parseFloat(price),
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
