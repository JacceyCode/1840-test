import { TaskPriority, TaskStatus } from "./enum";

export declare global {
  interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    priority: TaskPriority;
    status: TaskStatus;
  }
}
