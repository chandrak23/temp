const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3001;

const kafka = new Kafka({
  clientId: 'your-app',
  brokers: ['your-kafka-broker-url:9092'],
});

const producer = kafka.producer();
const requestConsumer = kafka.consumer({ groupId: 'request-group' });
const responseConsumer = kafka.consumer({ groupId: 'response-group' });

// Connect to Kafka producer
producer.connect();

// Connect to Kafka consumers and subscribe to topics
requestConsumer.connect().then(() => requestConsumer.subscribe({ topic: 'request-topic' }));
responseConsumer.connect().then(() => responseConsumer.subscribe({ topic: 'response-topic' }));

// REST API endpoint to send a request
app.post('/send-request', async (req, res) => {
  const { requestTopic, responseTopic, message } = req.body;

  // Produce the request to the specified topic
  await producer.send({
    topic: requestTopic,
    messages: [{ value: message }],
  });

  res.json({ success: true, message: 'Request sent successfully' });
});

// REST API endpoint to get responses
app.get('/get-responses', async (req, res) => {
  const responses = [];

  // Consume responses from the specified topic
  await responseConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      responses.push({
        topic,
        value: message.value.toString(),
      });
    },
  });

  res.json(responses);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
