import { Kafka, logLevel } from 'kafkajs';
import type { Producer } from 'kafkajs';

let producer: Producer | null = null;
let initPromise: Promise<void> | null = null;

const brokers = (process.env.KAFKA_BROKERS || '').split(',').map((b) => b.trim()).filter(Boolean);

export const isKafkaEnabled = brokers.length > 0;

const getProducer = async (): Promise<Producer | null> => {
  if (!isKafkaEnabled) return null;
  if (producer) return producer;
  if (!initPromise) {
    initPromise = (async () => {
      const kafka = new Kafka({
        clientId: 'cuy-backend',
        brokers,
        logLevel: logLevel.INFO,
      });
      producer = kafka.producer();
      await producer.connect();
    })().catch((err) => {
      initPromise = null;
      producer = null;
      console.warn('[kafka] no disponible:', err instanceof Error ? err.message : err);
    });
  }
  await initPromise;
  return producer;
};

export const publishEvent = async (
  topic: string,
  event: { type: string; timestamp: string; data: unknown }
): Promise<boolean> => {
  try {
    const kafkaProducer = await getProducer();
    if (!kafkaProducer) return false;
    await kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }],
    });
    return true;
  } catch (err) {
    console.warn('[kafka] error publicando evento:', err instanceof Error ? err.message : err);
    return false;
  }
};

export const orderEvent = (type: string, data: unknown) =>
  publishEvent('cuy.events', {
    type: `order.${type}`,
    timestamp: new Date().toISOString(),
    data,
  });