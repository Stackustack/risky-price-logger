import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceLogRepository } from './price-log.repository';

@Injectable()
export class PriceLogsService {
    constructor(
        @InjectRepository(PriceLogRepository)
        private priceLogRepository: PriceLogRepository
    ) {}

    addNewLog(productId, price) {
        const date = new Date()
        price = parseInt(price.replace('.', ''))
        
        return this.priceLogRepository.addNewLog(productId, price, date)
    }
}
