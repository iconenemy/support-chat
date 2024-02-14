import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ObjectId, Types } from 'mongoose';
import { SupportAuthGuard } from 'src/auth/guards/support-auth.guard';
import { CreateMessageDto } from './dto/message.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @UseGuards(SupportAuthGuard)
    @Get()
    findAll() {
        return this.messageService.findAll();
    }

    @UseGuards(SupportAuthGuard)
    @Get('name/:id')
    async findByRoom(@Param(':id') room: Types.ObjectId) {
        return await this.messageService.findManyByRoom(room);
    }

    @Post()
    create(@Body() payload: CreateMessageDto) {
        return this.messageService.create(payload)
    }
}
