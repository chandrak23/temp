import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private producer: any;
  private consumer: any;

  constructor(@Inject(Kafka) private readonly kafkaClient: Kafka) {}

  async onModuleInit() {
    this.producer = this.kafkaClient.producer();
    await this.producer.connect();
    this.consumer = this.kafkaClient.consumer({ groupId: 'response-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'topic_0', fromBeginning: true });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: any, correlationId: string) {
    await this.producer.send({
      topic,
      messages: [{
        value: JSON.stringify(message),
        headers: { correlationId },
      }],
    });
  }

  async consume(topic: string, correlationId: string) {
    try {
      return new Promise((resolve, reject) => {
        this.consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            const correlationIdFromMessage = message.headers.correlationId.toString();
            if (correlationIdFromMessage === correlationId) {
              resolve(message.value.toString());
              // Commit offset for this message
              await this.consumer.commitOffsets([{ topic, partition: message.partition, offset: message.offset + 1 }]);
            }
          },
        });
      });
    } catch (error) {
      console.error('Error consuming message:', error);
    }
  }
}
