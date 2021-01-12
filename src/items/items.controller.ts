import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
    @Get()
    getItems() {
        // #TODO: GET /items
    }

    @Post()
    addItem(
        @Body(ValidationPipe) createIteamDto: CreateItemDto
    ) {
        // #TODO: create entry of item in db
    }
}
