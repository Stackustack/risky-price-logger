import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { PriceLogsService } from './../price-logs/price-logs.service'
import { ProductSelectors } from './statics/product.selectors';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository,
        private priceLogService: PriceLogsService
    ) { }

    async findAll() {
        return this.productRepository.findAll()
    }

    async findById(id) {
        const found = await this.productRepository.findById(id)

        if (!found) {
            throw new NotFoundException(`Product with ID "${id}" not found`)
        }

        return found
    }

    async watchProduct(createProductDto: CreateProductDto): Promise<{
        // url: string,
        // name: string,
        // pictureUrl: string,
        // id: string,
    }> {
        const { url } = createProductDto
        const productAlreadyExists = await this.productRepository.findByUrl(url)

        if (productAlreadyExists) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: `Resource for url ${url} already exists`
            }, HttpStatus.CONFLICT)
        }

        const { price, pictureUrl } = await this.fetchPriceAndPicture(url)
        const productName = this.getReadableName(url)
        const product = await this.productRepository.add(url, productName, pictureUrl)
        const priceLog = await this.priceLogService.addNewLog(product, price)

        return ({
            product,
            priceLog
        })
    }

    @Cron('3 3 * * *')
    async updatePricesForAllProductsCrone() {
        const { PRICE } = ProductSelectors

        const products = await this.findAll()
        const prodsArrToUpdate = products.map((el) => {
            return { id: el.id, url: el.url, newPrice: undefined }
        })


        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

        const prodsWithNewPrices = await Promise.all(prodsArrToUpdate.map(async product => {
            let page = await browser.newPage()

            await page.goto(product.url)

            const newPrice = await page.evaluate(PRICE => {
                return document.querySelector(PRICE).textContent
            }, PRICE)

            product.newPrice = newPrice

            return {
                id: product.id,
                newPrice
            }
        }))

        await browser.close()

        const a = await Promise.all(prodsWithNewPrices.map(async product => {
            const { id, newPrice } = product

            return this.priceLogService.addNewLog(id, newPrice)
        }))
    }

    async refreshPrice(productId: string) {
        const product = await this.productRepository.findById(productId)

        if (!product) {
            throw new NotFoundException(`Product with id ${productId} not found`)
        }

        const price = await this.fetchPrice(product.url)

        return await this.priceLogService.addNewLog(productId, price)
    }

    async deleteProduct(uuid: string) {
        return this.productRepository.deleteProduct(uuid)
    }

    async fetchPriceAndPicture(url: string): Promise<{ price: number, pictureUrl: string }> {
        const { PRICE, PICTURE_URL } = ProductSelectors
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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

    async fetchPrice(url: string) {
        const { PRICE } = ProductSelectors
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();

        await page.goto(url);

        const price = await page.evaluate((PRICE) => {
            return document
                .querySelector(PRICE)
                .textContent
        }, PRICE);

        await browser.close();

        return price
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

    getNextToLastPriceAndDate(product) {
        let check = true
        let i = 0
        let previousPrice = null
        let priceChangeDate = null

        const revLogsArr = product.priceLogs.reverse()

        while (check) {
            if (revLogsArr[i + 1]) {
                if (revLogsArr[i + 1].price != revLogsArr[i].price) {
                    check = false
                    previousPrice = revLogsArr[i + 1].price
                    priceChangeDate = revLogsArr[i + 1].date
                } else {
                    i++
                }
            } else {
                check = false
            }
        }

        return { previousPrice, priceChangeDate }
    }

    calculateDiscount(currentPrice, previousPrice) {
        if (previousPrice == null) {
            return null
        }

        let r = Math.floor((previousPrice - currentPrice) / previousPrice * 100)

        return r >= 0 ?
            `-${r}%` :
            `+${Math.abs(r)}%`
    }

    convPennyToZL(price) {
        if (price == null) {
            return null
        }

        const decimalPoint = price.length - 2

        return `${price.substring(0, decimalPoint)}.${price.substring(decimalPoint)}`
    }
}
