import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { CustomExceptionFilter } from '@shared';
import * as cookieParser from 'cookie-parser';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      // options (same as WinstonModule.forRoot() options)
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
            winston.format.colorize({ all: true })
          ),
        }), // Error logs
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        // logging all level
        new winston.transports.File({
          filename: `logs/combined.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ],
    }),
  });

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
