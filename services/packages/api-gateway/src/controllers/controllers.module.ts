import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { AppService } from 'src/app.service';
import { AuthController } from './auth.controller';
import { NotificationsController } from './notifications.controller';
import { ServicesModule } from '../services/services.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ServicesModule, AuthModule], // Import ServicesModule and AuthModule to access required services
  controllers: [HealthController, AuthController, NotificationsController],
  providers: [AppService],
})
export class ControllersModule { }
