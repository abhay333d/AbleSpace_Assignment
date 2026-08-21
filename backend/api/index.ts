import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin:
        process.env.FRONTEND_URL ||
        'https://able-space-assignment-ruby.vercel.app',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function (req: any, res: any) {
  try {
    const server = await bootstrap();
    return server(req, res);
  } catch (err) {
    console.error('Nest Serverless Error:', err);
    res
      .status(500)
      .json({
        error: 'Internal Server Error (Serverless Init)',
        details: err.message,
      });
  }
}
