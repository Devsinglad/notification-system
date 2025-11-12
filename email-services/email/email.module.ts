import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

// the consumer that listens to the email queue in RabbitMQ
import { EmailConsumer } from './email.consumer';
import { TemplateClient } from './template.client';
import { RetryService } from './retry.service';
import { HttpModule } from '@nestjs/axios';

// RabbitMQ module import for NestJS integration
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    HttpModule,
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'notifications.direct',
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      // it doesn't wait for RabbitMQ server to be available before starting the app
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [EmailService, EmailConsumer, TemplateClient, RetryService],
  exports: [EmailService],
})
export class EmailModule {}
