import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { kafkaClient, kafkaConsumer, loggingLevel } from 'kafka'; // Kafka imports
import { getLogger } from 'logger'; // Logger

@Injectable()
export class FileUploadService {
  private producer: any;
  private consumer: any;

  constructor() {
    this.initializeKafkaProducer();
    this.initializeKafkaConsumer(); // Initialize the Kafka consumer
  }

  // Initialize Kafka producer
  private async initializeKafkaProducer() {
    const client = await kafkaClient(loggingLevel.INFO);
    this.producer = await kafkaProducer(client);
    getLogger().debug('FileUploadService: Kafka Producer initialized');
  }

  // Initialize Kafka consumer
  private async initializeKafkaConsumer() {
    const client = await kafkaClient(loggingLevel.INFO);
    this.consumer = await kafkaConsumer(['response-topic'], client, []); // 'response-topic' is where you expect the response
    this.consumer.on('message', async (message) => {
      const parsedMessage = JSON.parse(message.value.toString());
      getLogger().debug(`FileUploadService: Received message from Kafka: ${JSON.stringify(parsedMessage)}`);
      // Handle the response, e.g., save to DB, send to another service, etc.
    });
    getLogger().debug('FileUploadService: Kafka Consumer initialized and listening to response-topic');
  }

  // Function to handle file upload and Kafka message
  async uploadFile(file: Express.Multer.File, b_id: string, n_id: string): Promise<any> {
    try {
      // Simulating external file upload using Axios
      const uploadResponse = await axios.put('https://external-upload-service.com/upload', file.buffer);

      // On successful upload, get the uploaded file path
      const uploadedFilePath = uploadResponse.data.filePath;

      // Send the uploaded file path along with b_id and n_id to Kafka topic
      await this.produceKafkaMessage('file-upload-topic', uploadedFilePath, b_id, n_id);

      // Return the uploaded file path or any other response you need
      return { path: uploadedFilePath };
    } catch (err) {
      getLogger().error(`FileUploadService: Error uploading file: ${err.message}`);
      throw err;
    }
  }

  // Produce Kafka message with upload path, b_id, and n_id
  private async produceKafkaMessage(topic: string, filePath: string, b_id: string, n_id: string) {
    try {
      // Construct message payload
      const payload = {
        path: filePath,
        b_id: b_id,
        n_id: n_id,
      };

      // Send message to Kafka
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
      });

      getLogger().debug(`FileUploadService: Successfully sent message to Kafka topic ${topic}`);
    } catch (err) {
      getLogger().error(`FileUploadService: Error sending message to Kafka: ${err.message}`);
    }
  }
}
