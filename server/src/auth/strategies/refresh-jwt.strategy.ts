import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
	Strategy,
	'refresh-jwt'
) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				RefreshJwtStrategy.extractJWT,
				ExtractJwt.fromAuthHeaderAsBearerToken()
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('REFRESH_TOKEN_KEY'),
			passReqToCallback: true
		});
	}

	validate(req: RequestType, payload: any) {
		const { refresh_token } = req.cookies;
		return { ...payload, refresh_token };
	}

	private static extractJWT(req: RequestType): string | null {
		if (req.cookies && 'refresh_token' in req.cookies) {
			return req.cookies.refresh_token;
		}
		return null;
	}
}