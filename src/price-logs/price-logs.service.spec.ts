import { Test } from '@nestjs/testing';
import { PriceLogsService } from './price-logs.service';
import { PriceLogRepository } from './price-log.repository';
import { STATIC_DATA } from './../utils/statics';

const mockPriceLogRepository = () => ({
    addNewLog: jest.fn().mockReturnValue('PriceLog object')
})

describe('PriceLogService', () => {
    let priceLogsService: PriceLogsService;
    let priceLogRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PriceLogsService,
                {
                    provide: PriceLogRepository, useFactory: mockPriceLogRepository
                }
            ]
        }).compile()

        priceLogsService = await module.get<PriceLogsService>(PriceLogsService)
        priceLogRepository = await module.get<PriceLogRepository>(PriceLogRepository)
    })

    describe('addNewLog', () => {
        it('successfully calls addNewLog in repository with correct params', async () => {
            const spyOnDate = jest.spyOn(global, 'Date')
            expect(priceLogsService.addNewLog(STATIC_DATA.productId, "213.70")).toEqual('PriceLog object')
            
            const date = spyOnDate.mock.instances[0]
            expect(priceLogRepository.addNewLog).toHaveBeenCalledWith(STATIC_DATA.productId, 21370, date)
        })
    })
})