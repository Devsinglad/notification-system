import { Injectable } from '@nestjs/common';

// it listens to messages from the email queue in RabbitMQ
// tells rabbitmq which exchange, routing key and queue to listen to
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

// contains the business logic for processing emails
import { EmailService } from './email.service';

@Injectable()
export class EmailConsumer {
  constructor(private readonly emailService: EmailService) {}

  @RabbitSubscribe({
    exchange: 'notifications.direct',
    routingKey: 'email',
    queue: 'email.queue',
  })

  //   Better practice: define an interface like msg: EmailMessage
  async handleEmail(msg: any) {
    console.log('📩 Received message from email.queue:', msg);
    try {
      await this.emailService.processEmail(msg);
    } catch (err: any) {
      // Note: This is basic error handling. In production, you'd want to:
      // Log to a proper logging service
      // Potentially retry the message
      // Send the message to a dead letter queue
      // Alert monitoring systems
      // console.log(err);

      console.error('❌ Failed to process email:', err.message);
      // Could throw error to trigger RabbitMQ retry
      throw err;
    }
  }
}
