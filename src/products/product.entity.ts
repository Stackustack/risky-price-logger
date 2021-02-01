import { IsUrl, IsUUID } from "class-validator";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PriceLog } from '../price-logs/price-log.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsUrl()
    @Column()
    url: string;

    @Column()
    name: string;

    @Column()
    pictureUrl: string;

    @OneToMany(type => PriceLog, priceLog => priceLog.product)
    priceLogs: PriceLog[]
}