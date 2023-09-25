import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { LeavesModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { DBModule } from '@db';
import { ThrottlerModule } from '@nestjs/throttler';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mails/mail.module';
import { OffdaysModule } from './offdays/offdays.module';
import { FinyearModule } from './finyear/finyear.module';
import { SharedModule } from './shared/shared.module';
import { WorkerModule } from './worker/worker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ScheduleModule.forRoot(),
    MailModule,

    UsersModule,
    LeavesModule,
    AuthModule,
    DBModule,
    RolesModule,
    OffdaysModule,
    FinyearModule,
    SharedModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
