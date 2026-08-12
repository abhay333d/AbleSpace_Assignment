import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Replace with your MongoDB connection string
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/task-management'),
    TasksModule,
  ],
})
export class AppModule {}
