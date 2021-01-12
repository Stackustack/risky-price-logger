import { IsNotEmpty, IsUrl } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    @IsUrl()
    url: string
}