import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { RoomModule } from 'src/room/room.module';
import { MessageModule } from 'src/message/message.module';

@Module({
    imports: [JwtModule, UserModule, RoomModule, MessageModule],
    providers: [ChatGateway, ChatService],
})
export class ChatModule {}
