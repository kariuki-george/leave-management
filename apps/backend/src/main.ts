import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { CustomExceptionFilter } from '@shared';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ skipMissingProperties: true, whitelist: true })
  );
  app.use(helmet());
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow<string>('ORIGIN_URL'),
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(configService.getOrThrow<number>('PORT'));
  console.log('Server started at ' + (await app.getUrl()));
}
bootstrap();
