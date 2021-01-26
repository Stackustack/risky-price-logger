import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async add(url, name, pictureUrl) {
        let product = new Product()
        product.url = url
        product.name = name
        product.pictureUrl = pictureUrl

        try {
            await product.save()
        } catch(e) {
            console.log(e)
        }

        return product
    }

    async deleteProduct(uuid) {
        const result = await this.delete(uuid)

        if (result.affected == 0) {
            throw new NotFoundException(`Product with id ${uuid} not found`)
        }
        
        return result
    }
}