export class CreateTaskDto {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  project?: string;
  labels?: string[];
  resources?: { name: string; link: string }[];
  subtasks?: { title: string; isCompleted: boolean }[];
  dueDate?: Date;
  reporter?: string;
}
