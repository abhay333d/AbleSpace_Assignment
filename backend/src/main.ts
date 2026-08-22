import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from "express";

// 1. Initialize the Express engine for Vercel
const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.setGlobalPrefix('api');

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return server;
}

// 2. Export the Serverless Handler for Vercel
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  return app(req, res);
}

// 3. Keep the local server running for development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(() => {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Backend is running locally on port: ${port}`);
    });
  });
}
