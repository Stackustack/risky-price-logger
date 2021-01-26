import { EntityRepository, Repository } from "typeorm";
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    async add(url, name, pictureUrl) {
        let product = new Product()
        product.url = url
        product.name = name
        product.pictureUrl = pictureUrl

        await product.save()

        return product
    }
}