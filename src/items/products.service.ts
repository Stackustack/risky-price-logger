import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    async watchProduct(createProductDto: CreateProductDto) {
        const { url } = createProductDto 

        const price = await this.fetchPrice(url)
        const productName = this.getReadableName(url)

        // TODO 1: add product to DB (if its not there yet)
        // TODO 2: add priceLog for product

        return ({
            price,
            productName
        })

    }

    private async fetchPrice(url: string): Promise<number> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const price = await page.evaluate(() => {
            return document.querySelector(".ty-product-block__price-actual .ty-price-update .ty-price bdi .ty-price-num:first-of-type").textContent
        });

        await browser.close();

        return parseFloat(price)
    }

    private getReadableName(url: string): string {
        if (url.endsWith('/')) {
            url = url.slice(0, -1)
        } 

        const pathWithoutDashes = url.slice(url.lastIndexOf('/') + 1)
            .replace(/-/g, ' ')
        const productName = pathWithoutDashes.charAt(0).toUpperCase() + pathWithoutDashes.slice(1)

        return productName
    }
}
