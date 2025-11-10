import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { AppService } from 'src/app.service';
import { AuthController } from './auth.controller';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [HealthController, AuthController, NotificationsController],
  providers: [AppService],
})
export class ControllersModule { }
