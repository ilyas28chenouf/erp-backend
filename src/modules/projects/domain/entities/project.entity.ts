import { ProjectStatus } from '../enums/project-status.enum';

export class Project {
  id: string;
  name: string;
  clientName: string;
  location?: string | null;
  startDate: Date;
  deadline?: Date | null;
  status: ProjectStatus;
  responsibleUserId?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
