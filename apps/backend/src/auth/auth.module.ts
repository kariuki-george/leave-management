import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LeavesModule } from 'src/leaves/leaves.module';

@Global()
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, LeavesModule],
  exports: [AuthService],
})
export class AuthModule {}
