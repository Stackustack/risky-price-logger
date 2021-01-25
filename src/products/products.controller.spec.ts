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
        const result = 'Pure long sleeve art blue'
        const url = 'https://www.shop.com/en/clothes-category/blouses/pure-long-sleeve-art-blue'
        const urlWithSlash = url + '/'

        it('returns correct name', async () => {
            expect(await productsService.getReadableName(url)).toBe(result)
        })

        it('removes slash at the end of url', async () => {
            expect(await productsService.getReadableName(urlWithSlash)).toBe(result)
        })
    })
});