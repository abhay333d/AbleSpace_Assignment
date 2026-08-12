import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 'To Do' })
  status: string;

  @Prop({ default: 'Medium' })
  priority: string;

  @Prop()
  project: string;

  @Prop([String])
  labels: string[];

  @Prop([{ name: String, link: String }])
  resources: Record<string, any>[];

  @Prop([{ title: String, isCompleted: Boolean }])
  subtasks: Record<string, any>[];

  @Prop()
  dueDate: Date;

  @Prop()
  reporter: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
