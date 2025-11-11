import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

export interface QueueMessage {
  notification_id: string;
  type: 'email' | 'push';
  data: any;
  user_id?: string;
  timestamp: string;
  retry_count?: number;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private readonly queues: {
    email: string;
    push: string;
    status: string;
  };

  constructor(private configService: ConfigService) {
    // Initialize queue names with configuration values and defaults
    this.queues = {
      email: this.configService.get<string>('rabbitmq.queues.email', 'email_notifications'),
      push: this.configService.get<string>('rabbitmq.queues.push', 'push_notifications'),
      status: this.configService.get<string>('rabbitmq.queues.status', 'notification_status'),
    };
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      const rabbitmqUrl = this.configService.get<string>('rabbitmq.url');
      
      this.connection = amqp.connect([rabbitmqUrl], {
        heartbeatIntervalInSeconds: 30,
        reconnectTimeInSeconds: 5,
      });

      this.connection.on('connect', () => {
        this.logger.log('Successfully connected to RabbitMQ');
      });

      this.connection.on('disconnect', (err) => {
        this.logger.error('Disconnected from RabbitMQ', err);
      });

      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) => {
          // Declare all queues with durability
          await channel.assertQueue(this.queues.email, {
            durable: true,
            arguments: {
              'x-message-ttl': 86400000, // 24 hours
              'x-max-length': 10000,
            },
          });

          await channel.assertQueue(this.queues.push, {
            durable: true,
            arguments: {
              'x-message-ttl': 86400000,
              'x-max-length': 10000,
            },
          });

          await channel.assertQueue(this.queues.status, {
            durable: true,
            arguments: {
              'x-message-ttl': 604800000, // 7 days
              'x-max-length': 50000,
            },
          });

          this.logger.log('RabbitMQ queues declared successfully');
        },
      });

      await this.channelWrapper.waitForConnect();
      this.logger.log('RabbitMQ channel ready');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async publishToQueue(queueName: string, message: QueueMessage): Promise<boolean> {
    try {
      // Publish message to queue
      await this.channelWrapper.sendToQueue(queueName, message);

      this.logger.debug(`Message published to queue: ${queueName}`, {
        notification_id: message.notification_id,
      });

      return true;
    } catch (error) {
      this.logger.error(`Failed to publish message to queue: ${queueName}`, error);
      throw error;
    }
  }

  async publishEmailNotification(message: QueueMessage): Promise<boolean> {
    return this.publishToQueue(this.queues.email, message);
  }

  async publishPushNotification(message: QueueMessage): Promise<boolean> {
    return this.publishToQueue(this.queues.push, message);
  }

  async publishStatusUpdate(message: any): Promise<boolean> {
    return this.publishToQueue(this.queues.status, message);
  }

  // Method to consume from status queue (for tracking)
  async consumeStatusQueue(
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      await this.channelWrapper.addSetup((channel: ConfirmChannel) => {
        return channel.consume(
          this.queues.status,
          async (msg) => {
            if (msg) {
              try {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                channel.ack(msg);
              } catch (error) {
                this.logger.error('Error processing status message', error);
                channel.nack(msg, false, false);
              }
            }
          },
          { noAck: false },
        );
      });

      this.logger.log('Started consuming status queue');
    } catch (error) {
      this.logger.error('Failed to consume status queue', error);
      throw error;
    }
  }

  async getQueueStats(queueName: string): Promise<any> {
    try {
      return await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        return channel.checkQueue(queueName);
      });
    } catch (error) {
      this.logger.error(`Failed to get queue stats for: ${queueName}`, error);
      return null;
    }
  }

  private async disconnect() {
    try {
      await this.channelWrapper.close();
      await this.connection.close();
      this.logger.log('Disconnected from RabbitMQ');
    } catch (error) {
      this.logger.error('Error disconnecting from RabbitMQ', error);
    }
  }

  isConnected(): boolean {
    return this.connection?.isConnected() || false;
  }
}