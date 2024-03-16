// kafka.service.ts

import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'your-client-id',
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'your-consumer-group-id' });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consumeMessages(topic: string) {
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        console.log({
          topic,
          partition,
          value: message.value.toString(),
        });
      },
    });
  }
}
