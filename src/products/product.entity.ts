import { IsUrl, IsUUID } from "class-validator";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}