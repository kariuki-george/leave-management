import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LeavesModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { DBModule } from '@db';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mails/mail.module';
import { LoggerModule } from 'nestjs-pino';
import { OffdaysModule } from './offdays/offdays.module';
import { FinyearModule } from './finyear/finyear.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 1000 * 60 * 5, // Defaults to 5 min if no cache set
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MailModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport:
            configService.get('NODE_ENV') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                }
              : null,
          level: 'error',
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    LeavesModule,
    AuthModule,
    DBModule,
    RolesModule,
    OffdaysModule,
    FinyearModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
