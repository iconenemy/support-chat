import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection,
} from '@nestjs/websockets/interfaces/hooks';
import { Logger, UseGuards, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


import { ChatService } from './chat.service';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/middlewares/ws-auth.middleware';
import { CreateMessageDto, GetAllMessageDto, JoinedUserDto } from './dto/chat.dto';

@WebSocketGateway({
    transports: ['websocket'],
    cors: { origin: "*" },
    credentials: true
})
@UseGuards(WsJwtAuthGuard)
@Injectable()
export class ChatGateway
    implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
    constructor(
        private readonly configServie: ConfigService,
        private readonly jwtService: JwtService,
        private readonly chatService: ChatService,
    ) { }

    @WebSocketServer()
    server: Server;

    logger: Logger = new Logger(ChatGateway.name);

    afterInit(client: Socket) {
        client.use(
            SocketAuthMiddleware(this.jwtService, this.configServie) as any,
        );
        this.logger.log(`\x1b[35m User ${client.id} has been inited`);
    }

    async handleConnection(client: Socket) {
        const room = await this.chatService.connect(client);
        client.join(room)
        this.server.to(client.id).emit('getRoom', { room })
        this.logger.log(`\x1b[35m User has been success connected to ${room}`);
    }

    async handleDisconnect(client: Socket) {
        await this.chatService.disconnect(client);
        client.rooms.delete(client.id);
        this.logger.log(`\x1b[35m User ${client.id} has been disconnected`);
    }

    @SubscribeMessage('join')
    async joinToRoom(client: Socket, payload: JoinedUserDto) {
        const { room } = payload;
        const user = await this.chatService.joinToRoom(client, room);
        client.join(room);
        client.to(room).emit('newJoinedUser', user);
    }

    @SubscribeMessage('newMessage')
    async create(client: Socket, payload: CreateMessageDto) {
        const { room } = payload
        const message = await this.chatService.addMessage(client, payload);

        this.server.to(room).emit('recMessage', message);
    }

    @SubscribeMessage('getAllMessage')
    async findAll(client: Socket, payload: GetAllMessageDto) {
        const { room } = payload
        const messages = await this.chatService.findAll(room)
        
        this.server.to(client.id).emit('recAllMessage', messages);
    }
}
