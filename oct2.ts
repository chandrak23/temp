jest.mock('@grrs/server-shared-component_kafka', () => ({
    kafkaClient: jest.fn().mockReturnValue({
        brokers: ['localhost:9092'],
    }),
    kafkaProducer: jest.fn().mockReturnValue({
        send: jest.fn(),
    }),
}));
