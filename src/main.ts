import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

function validateEnvVariables() {
  const required = ['PORT', 'CORS_ORIGIN', 'CMS_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

async function bootstrap() {
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);

  // Set global API prefix for all routes
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  await app.listen(process.env.PORT!);

  console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN}`);
  console.log(`📚 CMS URL: ${process.env.CMS_URL}`);
}

void bootstrap();
