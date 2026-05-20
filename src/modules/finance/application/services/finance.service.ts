import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActionLogsService } from '../../../action-logs/action-logs.service';
import { FINANCE_REPOSITORY } from '../../domain/interfaces/finance.repository.interface';
import type { FinanceRepositoryInterface } from '../../domain/interfaces/finance.repository.interface';
import { CreateBudgetPlanDto } from '../dto/create-budget-plan.dto';
import { CreateCounterpartyDto } from '../dto/create-counterparty.dto';
import { CreateFinanceCategoryDto } from '../dto/create-finance-category.dto';
import { CreateFinanceSubcategoryDto } from '../dto/create-finance-subcategory.dto';
import { CreatePaymentRegistryEntryDto } from '../dto/create-payment-registry-entry.dto';
import { QueryBudgetPlansDto } from '../dto/query-budget-plans.dto';
import { QueryCounterpartiesDto } from '../dto/query-counterparties.dto';
import { QueryFinanceCategoriesDto } from '../dto/query-finance-categories.dto';
import { QueryFinanceSubcategoriesDto } from '../dto/query-finance-subcategories.dto';
import { QueryPaymentRegistryEntriesDto } from '../dto/query-payment-registry-entries.dto';
import { UpdateBudgetPlanDto } from '../dto/update-budget-plan.dto';
import { UpdateCounterpartyDto } from '../dto/update-counterparty.dto';
import { UpdateFinanceCategoryDto } from '../dto/update-finance-category.dto';
import { UpdateFinanceSubcategoryDto } from '../dto/update-finance-subcategory.dto';
import { UpdatePaymentRegistryEntryDto } from '../dto/update-payment-registry-entry.dto';

@Injectable()
export class FinanceService {
  constructor(
    @Inject(FINANCE_REPOSITORY)
    private readonly financeRepository: FinanceRepositoryInterface,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async createFinanceCategory(dto: CreateFinanceCategoryDto) {
    const created = await this.financeRepository.createFinanceCategory({
      ...dto,
      isActive: dto.isActive ?? true,
    });
    await this.actionLogsService.logCreate({
      entityType: 'FINANCE_CATEGORY',
      entityId: created.id,
      entityLabel: created.name,
      description: 'Finance category created.',
      afterData: created,
    });

    return created;
  }

  findFinanceCategories(query: QueryFinanceCategoriesDto) {
    return this.financeRepository.findFinanceCategories(query as Record<string, unknown>);
  }

  async findFinanceCategory(id: string) {
    const entity = await this.financeRepository.findFinanceCategoryById(id);
    if (!entity) throw new NotFoundException(`Finance category with id "${id}" was not found.`);
    return entity;
  }

  async updateFinanceCategory(id: string, dto: UpdateFinanceCategoryDto) {
    const existing = await this.findFinanceCategory(id);
    const updated = await this.financeRepository.updateFinanceCategory(id, dto);
    if (!updated) throw new NotFoundException(`Finance category with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'FINANCE_CATEGORY',
      entityId: updated.id,
      entityLabel: updated.name,
      description: 'Finance category updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async removeFinanceCategory(id: string) {
    const existing = await this.findFinanceCategory(id);
    await this.financeRepository.removeFinanceCategory(id);
    await this.actionLogsService.logDelete({
      entityType: 'FINANCE_CATEGORY',
      entityId: existing.id,
      entityLabel: existing.name,
      description: 'Finance category deleted.',
      beforeData: existing,
    });
  }

  async createFinanceSubcategory(dto: CreateFinanceSubcategoryDto) {
    const created = await this.financeRepository.createFinanceSubcategory({
      ...dto,
      isActive: dto.isActive ?? true,
    });
    await this.actionLogsService.logCreate({
      entityType: 'FINANCE_SUBCATEGORY',
      entityId: created.id,
      entityLabel: created.name,
      description: 'Finance subcategory created.',
      afterData: created,
    });

    return created;
  }

  findFinanceSubcategories(query: QueryFinanceSubcategoriesDto) {
    return this.financeRepository.findFinanceSubcategories(query as Record<string, unknown>);
  }

  async findFinanceSubcategory(id: string) {
    const entity = await this.financeRepository.findFinanceSubcategoryById(id);
    if (!entity) throw new NotFoundException(`Finance subcategory with id "${id}" was not found.`);
    return entity;
  }

  async updateFinanceSubcategory(id: string, dto: UpdateFinanceSubcategoryDto) {
    const existing = await this.findFinanceSubcategory(id);
    const updated = await this.financeRepository.updateFinanceSubcategory(id, dto);
    if (!updated) throw new NotFoundException(`Finance subcategory with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'FINANCE_SUBCATEGORY',
      entityId: updated.id,
      entityLabel: updated.name,
      description: 'Finance subcategory updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async removeFinanceSubcategory(id: string) {
    const existing = await this.findFinanceSubcategory(id);
    await this.financeRepository.removeFinanceSubcategory(id);
    await this.actionLogsService.logDelete({
      entityType: 'FINANCE_SUBCATEGORY',
      entityId: existing.id,
      entityLabel: existing.name,
      description: 'Finance subcategory deleted.',
      beforeData: existing,
    });
  }

  createCounterparty(dto: CreateCounterpartyDto) {
    return this.financeRepository.createCounterparty(dto);
  }

  findCounterparties(query: QueryCounterpartiesDto) {
    return this.financeRepository.findCounterparties(query as Record<string, unknown>);
  }

  async findCounterparty(id: string) {
    const entity = await this.financeRepository.findCounterpartyById(id);
    if (!entity) throw new NotFoundException(`Counterparty with id "${id}" was not found.`);
    return entity;
  }

  async updateCounterparty(id: string, dto: UpdateCounterpartyDto) {
    const updated = await this.financeRepository.updateCounterparty(id, dto);
    if (!updated) throw new NotFoundException(`Counterparty with id "${id}" was not found.`);
    return updated;
  }

  async removeCounterparty(id: string) {
    await this.findCounterparty(id);
    await this.financeRepository.removeCounterparty(id);
  }

  async createPaymentRegistryEntry(dto: CreatePaymentRegistryEntryDto) {
    const created = await this.financeRepository.createPaymentRegistryEntry(dto);
    await this.actionLogsService.logCreate({
      entityType: 'PAYMENT_REGISTRY_ENTRY',
      entityId: created.id,
      entityLabel: created.weekLabel ?? null,
      description: 'Payment registry entry created.',
      afterData: created,
    });

    return created;
  }

  findPaymentRegistryEntries(query: QueryPaymentRegistryEntriesDto) {
    return this.financeRepository.findPaymentRegistryEntries(query as Record<string, unknown>);
  }

  async findPaymentRegistryEntry(id: string) {
    const entity = await this.financeRepository.findPaymentRegistryEntryById(id);
    if (!entity) throw new NotFoundException(`Payment registry entry with id "${id}" was not found.`);
    return entity;
  }

  async updatePaymentRegistryEntry(id: string, dto: UpdatePaymentRegistryEntryDto) {
    const existing = await this.findPaymentRegistryEntry(id);
    const updated = await this.financeRepository.updatePaymentRegistryEntry(id, dto);
    if (!updated) throw new NotFoundException(`Payment registry entry with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'PAYMENT_REGISTRY_ENTRY',
      entityId: updated.id,
      entityLabel: updated.weekLabel ?? null,
      description: 'Payment registry entry updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async removePaymentRegistryEntry(id: string) {
    const existing = await this.findPaymentRegistryEntry(id);
    await this.financeRepository.removePaymentRegistryEntry(id);
    await this.actionLogsService.logDelete({
      entityType: 'PAYMENT_REGISTRY_ENTRY',
      entityId: existing.id,
      entityLabel: existing.weekLabel ?? null,
      description: 'Payment registry entry deleted.',
      beforeData: existing,
    });
  }

  createBudgetPlan(dto: CreateBudgetPlanDto) {
    return this.financeRepository.createBudgetPlan(dto);
  }

  findBudgetPlans(query: QueryBudgetPlansDto) {
    return this.financeRepository.findBudgetPlans(query as Record<string, unknown>);
  }

  async findBudgetPlan(id: string) {
    const entity = await this.financeRepository.findBudgetPlanById(id);
    if (!entity) throw new NotFoundException(`Budget plan with id "${id}" was not found.`);
    return entity;
  }

  async updateBudgetPlan(id: string, dto: UpdateBudgetPlanDto) {
    const updated = await this.financeRepository.updateBudgetPlan(id, dto);
    if (!updated) throw new NotFoundException(`Budget plan with id "${id}" was not found.`);
    return updated;
  }

  async removeBudgetPlan(id: string) {
    await this.findBudgetPlan(id);
    await this.financeRepository.removeBudgetPlan(id);
  }
}
