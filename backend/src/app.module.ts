import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // 1. Load the .env file globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Safely load the MongoDB URI from the .env file
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      }),
      inject: [ConfigService],
    }),

    TasksModule,
  ],
})
export class AppModule {}
