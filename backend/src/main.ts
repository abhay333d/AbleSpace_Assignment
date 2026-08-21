import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. DYNAMIC CORS: Trust the production URL, fallback to localhost
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 2. DYNAMIC PORT: Let the cloud provider assign the port, fallback to 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Backend is running on port: ${port}`);
}
bootstrap().catch((err) => console.error(err));
