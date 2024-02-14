import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

const bootstrap = async () => {
    try {
        const app = await NestFactory.create(AppModule);
        const configService = app.get(ConfigService);

        app.enableCors({
            origin: [configService.getOrThrow<string>('CLIENT_URL')],
            credentials: true,
        });
        app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
        app.setGlobalPrefix('api');
        app.use(cookieParser());

        const PORT = configService.getOrThrow<number>('PORT');
        await app.listen(PORT, () =>
            console.log(`Server has been starting on port ${PORT}`),
        );
    } catch (err) {
        console.log(err);
    }
};
bootstrap();
