import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AppService } from 'src/app.service';

@Module({
  imports: [UsersModule], // Import UsersModule to access UsersService
  controllers: [HealthController, AuthController],
  providers: [AppService]
})
export class ControllersModule { }
