import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { FinanceCategoryType } from '../../domain/enums/finance-category-type.enum';
import { BudgetPlanOrmEntity } from './budget-plan.orm-entity';
import { PaymentRegistryEntryOrmEntity } from './payment-registry-entry.orm-entity';

@Entity({ name: 'finance_categories' })
export class FinanceCategoryOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ enum: FinanceCategoryType, enumName: 'FinanceCategoryType' })
  @Column({ type: 'enum', enum: FinanceCategoryType })
  type: FinanceCategoryType;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => PaymentRegistryEntryOrmEntity, (entry) => entry.category)
  paymentRegistryEntries?: PaymentRegistryEntryOrmEntity[];

  @OneToMany(() => BudgetPlanOrmEntity, (budgetPlan) => budgetPlan.category)
  budgetPlans?: BudgetPlanOrmEntity[];
}
