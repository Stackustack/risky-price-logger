import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../products/product.entity';

@Entity()
export class PriceLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal') // stored in GROSZ (1/100 of PLN)
    price: number;

    @Column('date')
    date: Date;

    @ManyToOne(type => Product, product => product.priceLogs)
    product: Product
}
