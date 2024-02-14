import {
    Injectable,
    NotAcceptableException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { JwtIssueDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    async signUp(payload: SignUpDto) {
        return await this.userService.create(payload);
    }

    async signIn(payload: SignInDto) {
        const { username, password } = payload;
        const findUser = await this.userService.findByUsername(username);

        if (!findUser || !(await bcrypt.compare(password, findUser.password)))
            throw new NotAcceptableException('Incorrect login credentials!');

        const { _id, role } = findUser;
        const { access_token, refresh_token } = await this.issueToken({
            _id,
            username,
            role,
        });

        const hashedToken = await bcrypt.hash(refresh_token, 10);
        this.userService.updateHashedToken(_id, hashedToken);

        return { user: { _id, username, role }, access_token, refresh_token };
    }

    private async issueToken(payload: JwtIssueDto) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
                expiresIn: this.configService.get<string>(
                    'ACCESS_TOKEN_EXPIRES_IN',
                ),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
                expiresIn: this.configService.get<string>(
                    'REFRESH_TOKEN_EXPIRES_IN',
                ),
            }),
        ]);

        return {
            access_token,
            refresh_token,
        };
    }

    async logout(_id: Types.ObjectId, token: string) {
        if (!_id || !token) {
            throw new UnauthorizedException(
                'The client does not have access rights to the content (logout)',
            );
        }
        await this.userService.updateHashedToken(_id, null);
    }

    async refresh(_id: Types.ObjectId, token: string) {
        if (!_id || !token) {
            throw new UnauthorizedException(
                'The client does not have access rights to the content (refresh)',
            );
        }
        const user = await this.userService.findOne(_id);
        if (!user)
            throw new UnauthorizedException('Incorrect login credentials!');

        const { role, username } = user;

        const payload = { _id, username, role };

        const { refresh_token, access_token } = await this.issueToken(payload);

        const hashedToken = await bcrypt.hash(refresh_token, 10);
        this.userService.updateHashedToken(_id, hashedToken);

        return { refresh_token, access_token, user: { _id, username, role } };
    }
}
