import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.strategy';

@Module({
  providers: [AuthService, JwtService]
})
export class AuthModule {}
