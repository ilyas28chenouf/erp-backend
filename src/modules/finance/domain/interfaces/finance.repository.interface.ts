import { BudgetPlanOrmEntity } from '../../infrastructure/persistence/budget-plan.orm-entity';
import { CounterpartyOrmEntity } from '../../infrastructure/persistence/counterparty.orm-entity';
import { FinanceCategoryOrmEntity } from '../../infrastructure/persistence/finance-category.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../../infrastructure/persistence/payment-registry-entry.orm-entity';

export interface FinanceRepositoryInterface {
  createFinanceCategory(
    entity: Partial<FinanceCategoryOrmEntity>,
  ): Promise<FinanceCategoryOrmEntity>;
  findFinanceCategories(
    filters?: Record<string, unknown>,
  ): Promise<FinanceCategoryOrmEntity[]>;
  findFinanceCategoryById(id: string): Promise<FinanceCategoryOrmEntity | null>;
  updateFinanceCategory(
    id: string,
    payload: Partial<FinanceCategoryOrmEntity>,
  ): Promise<FinanceCategoryOrmEntity | null>;
  removeFinanceCategory(id: string): Promise<void>;
  createCounterparty(
    entity: Partial<CounterpartyOrmEntity>,
  ): Promise<CounterpartyOrmEntity>;
  findCounterparties(
    filters?: Record<string, unknown>,
  ): Promise<CounterpartyOrmEntity[]>;
  findCounterpartyById(id: string): Promise<CounterpartyOrmEntity | null>;
  updateCounterparty(
    id: string,
    payload: Partial<CounterpartyOrmEntity>,
  ): Promise<CounterpartyOrmEntity | null>;
  removeCounterparty(id: string): Promise<void>;
  createPaymentRegistryEntry(
    entity: Partial<PaymentRegistryEntryOrmEntity>,
  ): Promise<PaymentRegistryEntryOrmEntity>;
  findPaymentRegistryEntries(
    filters?: Record<string, unknown>,
  ): Promise<PaymentRegistryEntryOrmEntity[]>;
  findPaymentRegistryEntryById(
    id: string,
  ): Promise<PaymentRegistryEntryOrmEntity | null>;
  updatePaymentRegistryEntry(
    id: string,
    payload: Partial<PaymentRegistryEntryOrmEntity>,
  ): Promise<PaymentRegistryEntryOrmEntity | null>;
  removePaymentRegistryEntry(id: string): Promise<void>;
  createBudgetPlan(entity: Partial<BudgetPlanOrmEntity>): Promise<BudgetPlanOrmEntity>;
  findBudgetPlans(filters?: Record<string, unknown>): Promise<BudgetPlanOrmEntity[]>;
  findBudgetPlanById(id: string): Promise<BudgetPlanOrmEntity | null>;
  updateBudgetPlan(
    id: string,
    payload: Partial<BudgetPlanOrmEntity>,
  ): Promise<BudgetPlanOrmEntity | null>;
  removeBudgetPlan(id: string): Promise<void>;
}

export const FINANCE_REPOSITORY = Symbol('FINANCE_REPOSITORY');
