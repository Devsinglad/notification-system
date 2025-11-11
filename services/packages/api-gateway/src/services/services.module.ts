import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RabbitMQService } from './rabbitmq.service';
import { RedisService } from './redis.service';
import { NotificationService } from './notification.service';
import { UserServiceClient } from './user-service.client';

@Module({
  imports: [HttpModule], // Import HttpModule to provide HttpService
  providers: [RabbitMQService, RedisService, NotificationService, UserServiceClient],
  exports: [UserServiceClient, NotificationService] // Export UserServiceClient and NotificationService so they can be used by other modules
})
export class ServicesModule {}
