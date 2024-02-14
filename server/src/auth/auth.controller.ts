import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Response,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtIssueDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async signUp(@Body() payload: SignUpDto) {
        return await this.authService.signUp(payload);
    }

    @Post('login')
    async signIn(
        @Body() payload: SignInDto,
        @Response({ passthrough: true }) res,
    ) {
        const { user, refresh_token, access_token } =
            await this.authService.signIn(payload);

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            expires: this.configService.get<number>('COOKIE_EXPIRES_TIME'),
            maxAge: this.configService.get<number>('COOKIE_MAX_AGE'),
        });

        return { user, tokens: { refresh_token, access_token } };
    }

    @Get('logout')
    @UseGuards(RefreshJwtGuard)
    logout(@Request() req, @Response({ passthrough: true }) res) {
        const { _id, refresh_token } = req.user;

        this.authService.logout(_id, refresh_token);

        res.clearCookie('refresh_token');
    }

    @Get('refresh')
    @UseGuards(RefreshJwtGuard)
    async refresh(@Request() req, @Response({ passthrough: true }) res) {
        const { _id: sub, refresh_token: token } = req.user;

        const {
            refresh_token,
            access_token,
            user: { _id, username, role },
        } = await this.authService.refresh(sub, token);

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            expires: this.configService.get<number>('COOKIE_EXPIRES_TIME'),
            maxAge: this.configService.get<number>('COOKIE_MAX_AGE'),
        });
        return {
            tokens: { refresh_token, access_token },
            user: { _id, username, role },
        };
    }
}
