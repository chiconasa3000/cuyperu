import app from './app';
import env from './config/env';
import prisma from './config/database';

const start = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to database');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();