const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'rest-api-client',
  brokers: ['your.kafka.broker:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'rest-api-group' });

const requestTopic = 'request-topic';
const responseTopic = 'response-topic';

app.post('/send-request', async (req, res) => {
  const requestData = req.body;

  await producer.connect();

  // Produce a request message to the request topic
  await producer.send({
    topic: requestTopic,
    messages: [
      { value: JSON.stringify(requestData) },
    ],
  });

  console.log('Request message sent to', requestTopic);

  await producer.disconnect();

  res.json({ message: 'Request sent successfully' });
});

app.listen(port, () => {
  console.log(`REST API is running on http://localhost:${port}`);
});
