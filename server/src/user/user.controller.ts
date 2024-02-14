import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ObjectId, Types } from 'mongoose';
import { AccessJwtGuard } from 'src/auth/guards/access-jwt.guard';
import { SupportAuthGuard } from 'src/auth/guards/support-auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @UseGuards(SupportAuthGuard)
    @Get()
    findAll(@Req() req: Request) {
        console.log(req.user);
        
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') _id: Types.ObjectId) {
        return this.userService.findOne(_id);
    }

    @Patch(':id')
    update(@Param('id') id: ObjectId, @Body() payload: UpdateUserDto) {
        return this.userService.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id') id: ObjectId) {
        return this.userService.remove(id);
    }
}
