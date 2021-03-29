import { Controller, Get, Render } from '@nestjs/common';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
    constructor(
        private productsService: ProductsService
    ) { }

    @Get()
    @Render('index')
    async root() {
        const prods = await this.productsService.findAll()

        console.log(prods)

        const preparedProdsData = prods.map(prod => {
            const currentPrice = prod.priceLogs[prod.priceLogs.length - 1].price
            const { previousPrice, priceChangeDate } = this.productsService.getNextToLastPriceAndDate(prod)
            const discountPerc = this.productsService.calculateDiscount(currentPrice, previousPrice)
            const currentPriceReadable = this.productsService.convPennyToZL(currentPrice)
            const previousPriceReadable = this.productsService.convPennyToZL(previousPrice)

            return {
                name: prod.name,
                pictureUrl: prod.pictureUrl,
                url: prod.url,
                currentPriceReadable,
                previousPriceReadable,
                discountPerc,
                priceChangeDate
            }
        })

        return { prods: preparedProdsData };
    }
}