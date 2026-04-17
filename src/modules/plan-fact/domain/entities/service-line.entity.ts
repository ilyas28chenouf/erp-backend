export class ServiceLine {
  id: string;
  customerId: string;
  projectId?: string | null;
  title: string;
  description?: string | null;
  plannedAmountYear?: string | null;
  receivedAdvance?: string | null;
  unclosedVolumeAmount?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
