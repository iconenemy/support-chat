import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        JwtModule,
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
