export class WorkOrder {
  id: string;
  serviceLineId: string;
  number: string;
  year: number;
  month: number;
  weekLabel?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
