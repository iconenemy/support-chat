import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room, RoomSchema } from './schema/room.schema';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        UserModule,
        MessageModule,
        JwtModule
    ],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService],
})
export class RoomModule {}
