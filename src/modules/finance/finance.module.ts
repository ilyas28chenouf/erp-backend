import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FINANCE_REPOSITORY } from './domain/interfaces/finance.repository.interface';
import { FinanceService } from './application/services/finance.service';
import { BudgetPlanOrmEntity } from './infrastructure/persistence/budget-plan.orm-entity';
import { CounterpartyOrmEntity } from './infrastructure/persistence/counterparty.orm-entity';
import { FinanceCategoryOrmEntity } from './infrastructure/persistence/finance-category.orm-entity';
import { FinanceSubcategoryOrmEntity } from './infrastructure/persistence/finance-subcategory.orm-entity';
import { PaymentRegistryEntryOrmEntity } from './infrastructure/persistence/payment-registry-entry.orm-entity';
import { FinanceRepository } from './infrastructure/repositories/finance.repository';
import { BudgetPlansController } from './presentation/controllers/budget-plans.controller';
import { CounterpartiesController } from './presentation/controllers/counterparties.controller';
import { FinanceCategoriesController } from './presentation/controllers/finance-categories.controller';
import { FinanceSubcategoriesController } from './presentation/controllers/finance-subcategories.controller';
import { PaymentRegistryEntriesController } from './presentation/controllers/payment-registry-entries.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinanceCategoryOrmEntity,
      FinanceSubcategoryOrmEntity,
      PaymentRegistryEntryOrmEntity,
      CounterpartyOrmEntity,
      BudgetPlanOrmEntity,
    ]),
  ],
  controllers: [
    FinanceCategoriesController,
    FinanceSubcategoriesController,
    PaymentRegistryEntriesController,
    CounterpartiesController,
    BudgetPlansController,
  ],
  providers: [
    FinanceService,
    FinanceRepository,
    { provide: FINANCE_REPOSITORY, useExisting: FinanceRepository },
  ],
  exports: [FinanceService, TypeOrmModule],
})
export class FinanceModule {}
