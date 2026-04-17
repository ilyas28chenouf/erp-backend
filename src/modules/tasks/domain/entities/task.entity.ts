import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class Task {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  assigneeUserId?: string | null;
  dueDate?: Date | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdByUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
