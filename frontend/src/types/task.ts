export type Priority = "Urgent" | "High" | "Medium" | "Low" | "No Priority";
export type Status = "To Do" | "Doing" | "Completed" | "On Hold";

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  dueDate: string;
  labels: string[];
}
