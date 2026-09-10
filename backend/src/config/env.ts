import 'dotenv/config';

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  redisUrl: process.env.REDIS_URL || '',
} as const;

export default env;