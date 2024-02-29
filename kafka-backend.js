const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka1:9092', 'kafka2:9092']
});
const consumer = kafka.consumer({ groupId: 'my-group' });

app.get('/kafka-data', async (req, res) => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
      res.send(message.value.toString());
    },
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
