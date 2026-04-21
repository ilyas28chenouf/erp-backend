import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { BudgetPlanOrmEntity } from './budget-plan.orm-entity';
import { FinanceSubcategoryOrmEntity } from './finance-subcategory.orm-entity';

@Entity({ name: 'finance_categories' })
export class FinanceCategoryOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(
    () => FinanceSubcategoryOrmEntity,
    (subcategory) => subcategory.category,
  )
  subcategories?: FinanceSubcategoryOrmEntity[];

  @OneToMany(() => BudgetPlanOrmEntity, (budgetPlan) => budgetPlan.category)
  budgetPlans?: BudgetPlanOrmEntity[];
}
