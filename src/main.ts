import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

function validateEnvVariables() {
  const required = ['CORS_ORIGIN', 'CMS_URL'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

async function bootstrap() {
  validateEnvVariables();

  const port = Number(process.env.PORT) || 3001;
  const swaggerServerUrl =
    process.env.SWAGGER_SERVER_URL ||
    (process.env.RAILWAY_STATIC_URL
      ? `https://${process.env.RAILWAY_STATIC_URL}`
      : `http://localhost:${port}`);

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Centralized API Gateway for multiple microservices')
    .setVersion('1.0')
    .addServer(swaggerServerUrl, 'API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN}`);
  console.log(`📚 CMS URL: ${process.env.CMS_URL}`);
  console.log(`📖 Swagger docs available at: ${swaggerServerUrl}/`);
}

void bootstrap();
