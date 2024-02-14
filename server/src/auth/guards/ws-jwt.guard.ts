import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() !== 'ws') {
            return true;
        }
        const client = context.switchToWs().getClient<Socket>();
        const token = this.extractTokenFromHeader(client);
        if (!token) {
            throw new UnauthorizedException("Token doesn't provided");
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
            });
            return payload;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(client: Socket): string | undefined {
        const [type, token] =
            client.handshake.auth?.token?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
