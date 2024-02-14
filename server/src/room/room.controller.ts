import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/room.dto';
import { SupportAuthGuard } from 'src/auth/guards/support-auth.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @UseGuards(SupportAuthGuard)
  @Get()
  async findAll() {
    return await this.roomService.findAll()
  }

  @UseGuards(SupportAuthGuard)
  @Get(':name')
  async findByName(@Param("name") name: string) {
    return await this.roomService.findRoomByName(name)
  }
}
