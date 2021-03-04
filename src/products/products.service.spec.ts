import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { PriceLogsService } from '../price-logs/price-logs.service';
import { PriceLogRepository } from '../price-logs/price-log.repository';
import { NotFoundException, HttpException } from '@nestjs/common';
import { STATIC_DATA } from './../utils/statics';
import { v4 as uuidv4 } from 'uuid'

const mockProductRepository = () => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    findByUrl: jest.fn(),
    add: jest.fn().mockReturnValue('Product object'),
    deleteProduct: jest.fn(),
})

describe('ProductsService', () => {
    let productsService: ProductsService
    let productRepository
    let priceLogsService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: ProductRepository, useFactory: mockProductRepository
                },
                PriceLogsService,
                PriceLogRepository,
            ]
        }).compile()

        productsService = await module.get<ProductsService>(ProductsService)
        productRepository = await module.get<ProductRepository>(ProductRepository)
        priceLogsService = await module.get<PriceLogsService>(PriceLogsService)
    })

    describe('findAll', () => {
        it('calls productRepository.findAll and succesfully retuns the products', async () => {
            productRepository.findAll.mockResolvedValue('products')

            expect(productRepository.findAll).not.toHaveBeenCalled()
            const result = await productsService.findAll()
            expect(productRepository.findAll).toHaveBeenCalled()
            expect(result).toEqual('products')
        })

    })
    
    describe('findById(id)', () => {
        const product_uuid = uuidv4()

        it('calls productRepository.findById and succesfully returns the product', async () => {
            productRepository.findById.mockResolvedValue('product') 
            
            expect(productRepository.findById).not.toHaveBeenCalled()
            const result = await productsService.findById(product_uuid)
            expect(productRepository.findById).toHaveBeenCalled()
            expect(productRepository.findById).toHaveBeenCalledWith(product_uuid)
            expect(result).toEqual('product')
        })

        it('throws an error as product is not found', async () => {
            expect(productRepository.findById).not.toHaveBeenCalled()
            productRepository.findById.mockResolvedValue(undefined) 
            
            await expect(productsService.findById(product_uuid)).rejects.toThrow(NotFoundException)
        })
    })

    describe('watchProduct(createProductDto)', () => {
        it('throws an error when product already is already watched', async () => {
            expect.assertions(2)
            productRepository.findByUrl.mockResolvedValue('foundItem')
            expect(productRepository.findByUrl).not.toHaveBeenCalled()
            await expect(productsService.watchProduct({url: STATIC_DATA.exampleShopUrl})).rejects.toThrow(HttpException)
        })

        it('calls for price, picture, name and returns correctly', async () => {
            productsService.fetchPriceAndPicture = jest.fn().mockReturnValue({
                price: 2137,
                pictureUrl: 'https://example.com'
            })
            productsService.getReadableName = jest.fn().mockReturnValue('Little chequered Dress Red')
            priceLogsService.addNewLog = jest.fn().mockReturnValue('PriceLog object')

            expect(productsService.fetchPriceAndPicture).not.toHaveBeenCalled()
            expect(productsService.getReadableName).not.toHaveBeenCalled()
            expect(productRepository.add).not.toHaveBeenCalled()
            expect(priceLogsService.addNewLog).not.toHaveBeenCalled()

            await expect(productsService.watchProduct({url: STATIC_DATA.exampleShopUrl})).resolves.toEqual(
                {
                    product: 'Product object',
                    priceLog: 'PriceLog object'
                }
            )

            expect(productsService.fetchPriceAndPicture).toBeCalledWith(STATIC_DATA.exampleShopUrl)
            expect(productsService.getReadableName).toHaveBeenCalledWith(STATIC_DATA.exampleShopUrl)
            expect(productRepository.add).toHaveBeenCalledWith(STATIC_DATA.exampleShopUrl, 'Little chequered Dress Red', 'https://example.com')
            expect(priceLogsService.addNewLog).toHaveBeenCalledWith('Product object', 2137)
        })
    })

    describe('refreshPrice(productId)', () => {
        it('calls for new price refresh and adds pricelog if item already exists', async () => {
            productRepository.findById = jest.fn().mockReturnValue({ url: STATIC_DATA.exampleShopUrl })
            productsService.fetchPrice = jest.fn().mockReturnValue(2137)
            priceLogsService.addNewLog = jest.fn().mockReturnValue('PriceLog object')

            await expect(productsService.refreshPrice('1f6588bb-a9b5-4862-a5b6-e976934a77d9')).resolves.toEqual('PriceLog object')

            expect(productRepository.findById).toHaveBeenCalledWith(STATIC_DATA.productId)
            expect(productsService.fetchPrice).toHaveBeenCalledWith(STATIC_DATA.exampleShopUrl)
            expect(priceLogsService.addNewLog).toHaveBeenCalledWith(STATIC_DATA.productId, 2137)
        })

        it('throws error if item not found', async () => {
            productRepository.findById = jest.fn().mockReturnValue(undefined)

            await expect(productsService.refreshPrice(STATIC_DATA.productId)).rejects.toThrow(NotFoundException)
        })
    })

    describe('deleteProduct(productId)', () => {
        it('calls to remove product correctly if product exists', () => {
            productRepository.deleteProduct = jest.fn().mockReturnValue('removed')

            expect(productsService.deleteProduct(STATIC_DATA.productId)).resolves.toEqual('removed')
            expect(productRepository.deleteProduct).toHaveBeenCalledWith(STATIC_DATA.productId)
        })

        it('throws error if item not found', () => {
            productRepository.deleteProduct = jest.fn().mockReturnValue(new NotFoundException)

            expect(productsService.deleteProduct(STATIC_DATA.productId)).resolves.toThrow(NotFoundException)
            expect(productRepository.deleteProduct).toHaveBeenCalledWith(STATIC_DATA.productId)
        })
    })

    describe('helper functions', () => {
        describe('getReadableName(url)', () => {
            const result = 'Pure long sleeve art blue'
            const url = 'https://www.shop.com/en/clothes-category/blouses/pure-long-sleeve-art-blue'
            const urlWithSlash = url + '/'
    
            it('returns correct product name from url', async () => {
                expect(productsService.getReadableName(url)).toBe(result)
            })
    
            it('returns correct product name if url ends with "/"', async () => {
                expect(productsService.getReadableName(urlWithSlash)).toBe(result)
            })
        })
    })
});