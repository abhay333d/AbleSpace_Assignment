import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This is critical to match your vercel.json routing
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

  // Vercel's auto-compiler will safely intercept this in production
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap().catch((err) => console.error(err));
