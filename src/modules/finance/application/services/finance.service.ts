import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  createFinanceCategory(dto: CreateFinanceCategoryDto) {
    return this.financeRepository.createFinanceCategory({
      ...dto,
      isActive: dto.isActive ?? true,
    });
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
    const updated = await this.financeRepository.updateFinanceCategory(id, dto);
    if (!updated) throw new NotFoundException(`Finance category with id "${id}" was not found.`);
    return updated;
  }

  async removeFinanceCategory(id: string) {
    await this.findFinanceCategory(id);
    await this.financeRepository.removeFinanceCategory(id);
  }

  createFinanceSubcategory(dto: CreateFinanceSubcategoryDto) {
    return this.financeRepository.createFinanceSubcategory({
      ...dto,
      isActive: dto.isActive ?? true,
    });
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
    const updated = await this.financeRepository.updateFinanceSubcategory(id, dto);
    if (!updated) throw new NotFoundException(`Finance subcategory with id "${id}" was not found.`);
    return updated;
  }

  async removeFinanceSubcategory(id: string) {
    await this.findFinanceSubcategory(id);
    await this.financeRepository.removeFinanceSubcategory(id);
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

  createPaymentRegistryEntry(dto: CreatePaymentRegistryEntryDto) {
    return this.financeRepository.createPaymentRegistryEntry(dto);
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
    const updated = await this.financeRepository.updatePaymentRegistryEntry(id, dto);
    if (!updated) throw new NotFoundException(`Payment registry entry with id "${id}" was not found.`);
    return updated;
  }

  async removePaymentRegistryEntry(id: string) {
    await this.findPaymentRegistryEntry(id);
    await this.financeRepository.removePaymentRegistryEntry(id);
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
