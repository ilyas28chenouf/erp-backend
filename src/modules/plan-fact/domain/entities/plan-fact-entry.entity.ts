export class PlanFactEntry {
  id: string;
  serviceLineId: string;
  workOrderId?: string | null;
  year: number;
  month: number;
  weekLabel?: string | null;
  naradPlan: string;
  naradFact: string;
  advancePlan: string;
  advanceFact: string;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
