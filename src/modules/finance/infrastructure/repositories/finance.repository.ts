import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QueryBudgetPlansDto } from '../../application/dto/query-budget-plans.dto';
import { QueryCounterpartiesDto } from '../../application/dto/query-counterparties.dto';
import { QueryFinanceCategoriesDto } from '../../application/dto/query-finance-categories.dto';
import { QueryPaymentRegistryEntriesDto } from '../../application/dto/query-payment-registry-entries.dto';
import { FinanceRepositoryInterface } from '../../domain/interfaces/finance.repository.interface';
import { BudgetPlanOrmEntity } from '../persistence/budget-plan.orm-entity';
import { CounterpartyOrmEntity } from '../persistence/counterparty.orm-entity';
import { FinanceCategoryOrmEntity } from '../persistence/finance-category.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../persistence/payment-registry-entry.orm-entity';

@Injectable()
export class FinanceRepository implements FinanceRepositoryInterface {
  constructor(
    @InjectRepository(FinanceCategoryOrmEntity)
    private readonly financeCategoriesRepository: Repository<FinanceCategoryOrmEntity>,
    @InjectRepository(CounterpartyOrmEntity)
    private readonly counterpartiesRepository: Repository<CounterpartyOrmEntity>,
    @InjectRepository(PaymentRegistryEntryOrmEntity)
    private readonly paymentRegistryEntriesRepository: Repository<PaymentRegistryEntryOrmEntity>,
    @InjectRepository(BudgetPlanOrmEntity)
    private readonly budgetPlansRepository: Repository<BudgetPlanOrmEntity>,
  ) {}

  createFinanceCategory(entity: Partial<FinanceCategoryOrmEntity>) {
    return this.financeCategoriesRepository.save(
      this.financeCategoriesRepository.create(entity),
    );
  }

  findFinanceCategories(filters?: QueryFinanceCategoriesDto) {
    const where: FindOptionsWhere<FinanceCategoryOrmEntity> = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (typeof filters?.isActive === 'boolean') where.isActive = filters.isActive;
    return this.financeCategoriesRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  findFinanceCategoryById(id: string) {
    return this.financeCategoriesRepository.findOne({ where: { id } });
  }

  async updateFinanceCategory(id: string, payload: Partial<FinanceCategoryOrmEntity>) {
    const existing = await this.findFinanceCategoryById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.financeCategoriesRepository.save(existing);
  }

  async removeFinanceCategory(id: string) {
    await this.financeCategoriesRepository.delete(id);
  }

  createCounterparty(entity: Partial<CounterpartyOrmEntity>) {
    return this.counterpartiesRepository.save(this.counterpartiesRepository.create(entity));
  }

  findCounterparties(filters?: QueryCounterpartiesDto) {
    const where: FindOptionsWhere<CounterpartyOrmEntity> = {};
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (filters?.inn) where.inn = ILike(`%${filters.inn}%`);
    return this.counterpartiesRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  findCounterpartyById(id: string) {
    return this.counterpartiesRepository.findOne({ where: { id } });
  }

  async updateCounterparty(id: string, payload: Partial<CounterpartyOrmEntity>) {
    const existing = await this.findCounterpartyById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.counterpartiesRepository.save(existing);
  }

  async removeCounterparty(id: string) {
    await this.counterpartiesRepository.delete(id);
  }

  createPaymentRegistryEntry(entity: Partial<PaymentRegistryEntryOrmEntity>) {
    return this.paymentRegistryEntriesRepository.save(
      this.paymentRegistryEntriesRepository.create(entity),
    );
  }

  findPaymentRegistryEntries(filters?: QueryPaymentRegistryEntriesDto) {
    return this.paymentRegistryEntriesRepository.find({
      where: {
        type: filters?.type,
        projectId: filters?.projectId,
        counterpartyId: filters?.counterpartyId,
        categoryId: filters?.categoryId,
      },
      relations: { project: true, counterparty: true, category: true, createdByUser: true },
      order: { operationDate: 'DESC', createdAt: 'DESC' },
    });
  }

  findPaymentRegistryEntryById(id: string) {
    return this.paymentRegistryEntriesRepository.findOne({
      where: { id },
      relations: { project: true, counterparty: true, category: true, createdByUser: true },
    });
  }

  async updatePaymentRegistryEntry(id: string, payload: Partial<PaymentRegistryEntryOrmEntity>) {
    const existing = await this.findPaymentRegistryEntryById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.paymentRegistryEntriesRepository.save(existing);
  }

  async removePaymentRegistryEntry(id: string) {
    await this.paymentRegistryEntriesRepository.delete(id);
  }

  createBudgetPlan(entity: Partial<BudgetPlanOrmEntity>) {
    return this.budgetPlansRepository.save(this.budgetPlansRepository.create(entity));
  }

  findBudgetPlans(filters?: QueryBudgetPlansDto) {
    return this.budgetPlansRepository.find({
      where: {
        projectId: filters?.projectId,
        categoryId: filters?.categoryId,
        periodYear: filters?.periodYear,
        periodMonth: filters?.periodMonth,
      },
      relations: { project: true, category: true },
      order: { createdAt: 'DESC' },
    });
  }

  findBudgetPlanById(id: string) {
    return this.budgetPlansRepository.findOne({
      where: { id },
      relations: { project: true, category: true },
    });
  }

  async updateBudgetPlan(id: string, payload: Partial<BudgetPlanOrmEntity>) {
    const existing = await this.findBudgetPlanById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.budgetPlansRepository.save(existing);
  }

  async removeBudgetPlan(id: string) {
    await this.budgetPlansRepository.delete(id);
  }
}
