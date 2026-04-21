import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QueryBudgetPlansDto } from '../../application/dto/query-budget-plans.dto';
import { QueryCounterpartiesDto } from '../../application/dto/query-counterparties.dto';
import { QueryFinanceCategoriesDto } from '../../application/dto/query-finance-categories.dto';
import { QueryFinanceSubcategoriesDto } from '../../application/dto/query-finance-subcategories.dto';
import { QueryPaymentRegistryEntriesDto } from '../../application/dto/query-payment-registry-entries.dto';
import { FinanceRepositoryInterface } from '../../domain/interfaces/finance.repository.interface';
import { BudgetPlanOrmEntity } from '../persistence/budget-plan.orm-entity';
import { CounterpartyOrmEntity } from '../persistence/counterparty.orm-entity';
import { FinanceCategoryOrmEntity } from '../persistence/finance-category.orm-entity';
import { FinanceSubcategoryOrmEntity } from '../persistence/finance-subcategory.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../persistence/payment-registry-entry.orm-entity';

@Injectable()
export class FinanceRepository implements FinanceRepositoryInterface {
  constructor(
    @InjectRepository(FinanceCategoryOrmEntity)
    private readonly financeCategoriesRepository: Repository<FinanceCategoryOrmEntity>,
    @InjectRepository(FinanceSubcategoryOrmEntity)
    private readonly financeSubcategoriesRepository: Repository<FinanceSubcategoryOrmEntity>,
    @InjectRepository(CounterpartyOrmEntity)
    private readonly counterpartiesRepository: Repository<CounterpartyOrmEntity>,
    @InjectRepository(PaymentRegistryEntryOrmEntity)
    private readonly paymentRegistryEntriesRepository: Repository<PaymentRegistryEntryOrmEntity>,
    @InjectRepository(BudgetPlanOrmEntity)
    private readonly budgetPlansRepository: Repository<BudgetPlanOrmEntity>,
  ) {}

  createFinanceCategory(entity: Partial<FinanceCategoryOrmEntity>) {
    return this.financeCategoriesRepository.save(this.financeCategoriesRepository.create(entity));
  }

  findFinanceCategories(filters?: QueryFinanceCategoriesDto) {
    const where: FindOptionsWhere<FinanceCategoryOrmEntity> = {};
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (typeof filters?.isActive === 'boolean') where.isActive = filters.isActive;
    return this.financeCategoriesRepository.find({
      where,
      relations: { subcategories: true },
      order: { createdAt: 'DESC' },
    });
  }

  findFinanceCategoryById(id: string) {
    return this.financeCategoriesRepository.findOne({
      where: { id },
      relations: { subcategories: true },
    });
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

  createFinanceSubcategory(entity: Partial<FinanceSubcategoryOrmEntity>) {
    return this.financeSubcategoriesRepository.save(this.financeSubcategoriesRepository.create(entity));
  }

  findFinanceSubcategories(filters?: QueryFinanceSubcategoriesDto) {
    return this.financeSubcategoriesRepository.find({
      where: {
        categoryId: filters?.categoryId,
        type: filters?.type,
        isActive: filters?.isActive,
      },
      relations: { category: true, paymentRegistryEntries: true },
      order: { createdAt: 'DESC' },
    });
  }

  findFinanceSubcategoryById(id: string) {
    return this.financeSubcategoriesRepository.findOne({
      where: { id },
      relations: { category: true, paymentRegistryEntries: true },
    });
  }

  async updateFinanceSubcategory(
    id: string,
    payload: Partial<FinanceSubcategoryOrmEntity>,
  ) {
    const existing = await this.findFinanceSubcategoryById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.financeSubcategoriesRepository.save(existing);
  }

  async removeFinanceSubcategory(id: string) {
    await this.financeSubcategoriesRepository.delete(id);
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
    return this.paymentRegistryEntriesRepository.save(this.paymentRegistryEntriesRepository.create(entity));
  }

  async findPaymentRegistryEntries(filters?: QueryPaymentRegistryEntriesDto) {
    const qb = this.paymentRegistryEntriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.project', 'project')
      .leftJoinAndSelect('entry.counterparty', 'counterparty')
      .leftJoinAndSelect('entry.subcategory', 'subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .leftJoinAndSelect('entry.createdByUser', 'createdByUser')
      .orderBy('entry.year', 'DESC')
      .addOrderBy('entry.month', 'DESC')
      .addOrderBy('entry.weekLabel', 'ASC')
      .addOrderBy('entry.createdAt', 'DESC');

    if (filters?.subcategoryId) qb.andWhere('entry.subcategoryId = :subcategoryId', { subcategoryId: filters.subcategoryId });
    if (filters?.projectId) qb.andWhere('entry.projectId = :projectId', { projectId: filters.projectId });
    if (filters?.counterpartyId) qb.andWhere('entry.counterpartyId = :counterpartyId', { counterpartyId: filters.counterpartyId });
    if (typeof filters?.year === 'number') qb.andWhere('entry.year = :year', { year: filters.year });
    if (typeof filters?.month === 'number') qb.andWhere('entry.month = :month', { month: filters.month });
    if (filters?.weekLabel) qb.andWhere('entry.weekLabel = :weekLabel', { weekLabel: filters.weekLabel });

    return qb.getMany();
  }

  findPaymentRegistryEntryById(id: string) {
    return this.paymentRegistryEntriesRepository.findOne({
      where: { id },
      relations: { project: true, counterparty: true, subcategory: { category: true }, createdByUser: true },
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
