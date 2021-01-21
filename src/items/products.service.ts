import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
    watchProduct(createProductDto: CreateProductDto) {
        const { url } = createProductDto 

        const price = this.fetchPrice(url)
        // get readableName
        // add product to DB
        return price
    }

    private async fetchPrice(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);

        const price = await page.evaluate(() => {
            return document.querySelector(".ty-product-block__price-actual .ty-price-update .ty-price bdi .ty-price-num:first-of-type").textContent
        });

        console.log(price)

        await browser.close();

        return price
    }
}
