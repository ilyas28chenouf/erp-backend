import { FinanceCategoryType } from '../enums/finance-category-type.enum';

export class FinanceSubcategory {
  id: string;
  categoryId: string;
  name: string;
  type: FinanceCategoryType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
