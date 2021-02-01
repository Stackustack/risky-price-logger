import { EntityRepository, Repository } from 'typeorm';
import { PriceLog } from './price-log.entity';

@EntityRepository(PriceLog)
export class PriceLogRepository extends Repository<PriceLog> {
    async addNewLog(product, price, date): Promise<PriceLog> {
        const newPriceLog = new PriceLog()
        
        newPriceLog.price = price
        newPriceLog.date = date
        newPriceLog.product = product

        const result = await newPriceLog.save()

        return result
    }
}
