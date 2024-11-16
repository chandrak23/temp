import { Controller, Get, Post } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class YourController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('produce')
  async produceMessage() {
    await this.kafkaService.sendMessage('your-topic', 'Your message');
    return 'Message produced to Kafka';
  }

  @Get('consume')
  async consumeMessage() {
    await this.kafkaService.consumeMessages('your-topic');
    return 'Consuming messages from Kafka';
  }
}
