import { IsUrl } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsUrl()
    @Column()
    url: string;

    @Column()
    readableName: string;

    @Column()
    pictureUrl: string;

    @Column()
    price: number;
}