import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin: configService.getOrThrow<string[]>('ORIGIN_URL'),
  });
  await app.listen(configService.getOrThrow<number>('PORT'));
  console.log('Server started at ' + (await app.getUrl()));
}
bootstrap();
