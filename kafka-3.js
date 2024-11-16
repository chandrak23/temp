const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: 'your-client-id',
  brokers: ['your-broker-1:9092', 'your-broker-2:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'your-group-id' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'your-topic', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Handle incoming messages
      console.log({
        value: message.value.toString(),
        headers: message.headers,
      });
    },
  });
}

// Start the Kafka consumer
startConsumer();

app.use(express.json());

// REST API to produce (post) messages to Kafka topic
app.post('/produce', async (req, res) => {
  const { message } = req.body;

  try {
    await producer.connect();
    await producer.send({
      topic: 'your-topic',
      messages: [{ value: message }],
    });

    res.status(200).json({ success: true, message: 'Message sent to Kafka topic' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    await producer.disconnect();
  }
});

// REST API to consume (get) the latest message from Kafka topic
app.get('/consume', async (req, res) => {
  try {
    // Fetch the latest message from Kafka topic
    // Note: This is a simplified example, you might want to handle this differently in a production environment
    const messages = await consumer.consume({ topic: 'your-topic', maxWaitTimeInMs: 1000 });

    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1].value.toString();
      res.status(200).json({ success: true, latestMessage });
    } else {
      res.status(404).json({ success: false, message: 'No messages found in Kafka topic' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
