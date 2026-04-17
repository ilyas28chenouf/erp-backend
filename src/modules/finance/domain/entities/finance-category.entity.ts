import { FinanceCategoryType } from '../enums/finance-category-type.enum';

export class FinanceCategory {
  id: string;
  name: string;
  type: FinanceCategoryType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
