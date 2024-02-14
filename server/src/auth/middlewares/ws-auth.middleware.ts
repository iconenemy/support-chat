import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type SocketIOMiddleWare = {
    (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (
    jwtService: JwtService, configService: ConfigService
): SocketIOMiddleWare => {
    return async (client, next) => {
        try {
            const token: string =
                client.handshake?.auth?.token?.split(' ')[1] ?? null;
            await jwtService.verifyAsync(token, {
                secret: configService.get('ACCESS_TOKEN_KEY'),
            });
            next();
        } catch (error) {
            next(error);
        }
    };
};
