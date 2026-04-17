export class BudgetPlan {
  id: string;
  projectId?: string | null;
  categoryId: string;
  periodYear: number;
  periodMonth: number;
  plannedAmount: string;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
