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

  interface TaskFormProps {
    taskId: string | undefined;
    taskData: Task[];
    openDialog: boolean;
    setTaskId: Dispatch<SetStateAction<string | undefined>>;
    setTaskData: Dispatch<SetStateAction<Task[]>>;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
  }

  interface DetailsDialogProps {
    task: Task;
    openDetailsDialog: boolean;
    setOpenDetailsDialog: Dispatch<SetStateAction<boolean>>;
    handleTaskDetailUpdate: (task: Task) => void;
  }
}
