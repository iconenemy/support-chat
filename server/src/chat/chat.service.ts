import {
    Injectable,
    UnauthorizedException,
    NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator'

import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly messageService: MessageService,
        private readonly roomService: RoomService,
    ) { }


    async connect(client: Socket): Promise<string> {
        const { payload, user: { _id } } = await this.getTokenPayload(client)

        const { role } = payload;
        if (role !== 'guest') return client.id

        const findRoom = await this.roomService.findRoomByHost(_id)
        if (findRoom) return findRoom.room

        const config: Config = {
            dictionaries: [colors, adjectives, animals],
            separator: "-",
            style: 'lowerCase'
        }
        const roomName = uniqueNamesGenerator(config)

        await this.roomService.create({
            room: roomName,
            host: _id,
            user: [_id],
            chat: [],
            status: 'not started',
        });

        return roomName
    }

    disconnect(client: Socket) {
        return this.roomService.deleteByRoom(client.id);
    }

    async joinToRoom(client: Socket, room: string) {
        const { payload: tokenPayload } = await this.getTokenPayload(client)
        const { _id } = tokenPayload

        await this.roomService.addUserToRoom({ user: _id, room });
        return { user: _id }
    }

    async addMessage(client: Socket, payload: CreateMessageDto) {
        const { room, content } = payload

        const { payload: tokenPayload } = await this.getTokenPayload(client)
        const { _id } = tokenPayload

        const findRoom = await this.roomService.findRoomByName(room)
        if (!findRoom) throw new NotAcceptableException('Such room does not exist')

        const newMessage = await this.messageService.create({
            user: _id,
            content,
            room: findRoom._id
        })

        await this.roomService.addMessageToRoom({
            _id: findRoom._id,
            message: newMessage._id
        })
        
        const [message] = await this.messageService.findOne(newMessage._id)
        
        return message
    }

    async findAll(room: string) {
        const findRoom = await this.roomService.findRoomByName(room)
        if (!findRoom) throw new NotAcceptableException('Such room does not exist')

        return this.messageService.findManyByRoom(findRoom._id)
    }

    private async getTokenPayload(client: Socket) {
        const token =
            client.handshake?.auth?.token?.split(' ')[1] ?? null
        if (!token) throw new UnauthorizedException("Token doesn't provided");

        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
        });

        const findUser = await this.userService.findOne(payload._id);
        if (!findUser)
            throw new NotAcceptableException("User doen't exist");

        return { payload, user: findUser }
    }
}
