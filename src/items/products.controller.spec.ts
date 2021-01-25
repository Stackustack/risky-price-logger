import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
    let productsService: ProductsService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ProductsService]
        }).compile()

        productsService = module.get<ProductsService>(ProductsService)
    })

    describe('getReadableName', () => {
        it('returns correct name', async () => {
            const result = 'Pure long sleeve art blue'
            const url = 'https://www.shop.com/en/clothes-category/blouses/pure-long-sleeve-art-blue'

            expect(await productsService.getReadableName(url)).toBe(result)
        })

        it('removes slash at the end of url', async () => {
            const result = 'Pure long sleeve art blue'
            const url = 'https://www.shop.com/en/clothes-category/blouses/pure-long-sleeve-art-blue/' 

            expect(await productsService.getReadableName(url)).toBe(result)
        })
    })
});