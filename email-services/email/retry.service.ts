import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RetryService {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handleRetry(msg: any, queue: string, attempt: number) {
    const maxRetries = 4;
    if (attempt >= maxRetries) {
      console.log('💀 Moving message to failed.queue');
      await this.amqpConnection.publish('notifications.direct', 'failed', msg);
      return;
    }

    const delay = Math.pow(2, attempt) * 2000; // exponential backoff
    console.log(`⏳ Retrying in ${delay / 1000}s...`);

    setTimeout(() => {
      msg.attempt = attempt + 1;
      this.amqpConnection.publish('notifications.direct', queue, msg);
    }, delay);
  }
}
