import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsUrl()
    url: string
}