import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PLAN_FACT_REPOSITORY } from '../../domain/interfaces/plan-fact.repository.interface';
import type { PlanFactRepositoryInterface } from '../../domain/interfaces/plan-fact.repository.interface';
import { CreatePlanFactEntryDto } from '../dto/create-plan-fact-entry.dto';
import { CreateServiceLineDto } from '../dto/create-service-line.dto';
import { CreateWorkOrderDto } from '../dto/create-work-order.dto';
import { QueryDashboardSummaryDto } from '../dto/query-dashboard-summary.dto';
import { QueryPlanFactEntriesDto } from '../dto/query-plan-fact-entries.dto';
import { QueryServiceLinesDto } from '../dto/query-service-lines.dto';
import { QueryWorkOrdersDto } from '../dto/query-work-orders.dto';
import { UpdatePlanFactEntryDto } from '../dto/update-plan-fact-entry.dto';
import { UpdateServiceLineDto } from '../dto/update-service-line.dto';
import { UpdateWorkOrderDto } from '../dto/update-work-order.dto';

@Injectable()
export class PlanFactService {
  constructor(
    @Inject(PLAN_FACT_REPOSITORY)
    private readonly planFactRepository: PlanFactRepositoryInterface,
  ) {}

  createServiceLine(dto: CreateServiceLineDto) {
    return this.planFactRepository.createServiceLine({
      ...dto,
      isActive: dto.isActive ?? true,
    });
  }

  findServiceLines(query: QueryServiceLinesDto) {
    return this.planFactRepository.findServiceLines(query as Record<string, unknown>);
  }

  async findServiceLine(id: string) {
    const entity = await this.planFactRepository.findServiceLineById(id);
    if (!entity) throw new NotFoundException(`Service line with id "${id}" was not found.`);
    return entity;
  }

  async updateServiceLine(id: string, dto: UpdateServiceLineDto) {
    const updated = await this.planFactRepository.updateServiceLine(id, dto);
    if (!updated) throw new NotFoundException(`Service line with id "${id}" was not found.`);
    return updated;
  }

  async removeServiceLine(id: string) {
    await this.findServiceLine(id);
    await this.planFactRepository.removeServiceLine(id);
  }

  createWorkOrder(dto: CreateWorkOrderDto) {
    return this.planFactRepository.createWorkOrder(dto);
  }

  findWorkOrders(query: QueryWorkOrdersDto) {
    return this.planFactRepository.findWorkOrders(query as Record<string, unknown>);
  }

  async findWorkOrder(id: string) {
    const entity = await this.planFactRepository.findWorkOrderById(id);
    if (!entity) throw new NotFoundException(`Work order with id "${id}" was not found.`);
    return entity;
  }

  async updateWorkOrder(id: string, dto: UpdateWorkOrderDto) {
    const updated = await this.planFactRepository.updateWorkOrder(id, dto);
    if (!updated) throw new NotFoundException(`Work order with id "${id}" was not found.`);
    return updated;
  }

  async removeWorkOrder(id: string) {
    await this.findWorkOrder(id);
    await this.planFactRepository.removeWorkOrder(id);
  }

  createPlanFactEntry(dto: CreatePlanFactEntryDto) {
    return this.planFactRepository.createPlanFactEntry({
      ...dto,
      naradPlan: dto.naradPlan ?? '0.00',
      naradFact: dto.naradFact ?? '0.00',
      advancePlan: dto.advancePlan ?? '0.00',
      advanceFact: dto.advanceFact ?? '0.00',
    });
  }

  findPlanFactEntries(query: QueryPlanFactEntriesDto) {
    return this.planFactRepository.findPlanFactEntries(query as Record<string, unknown>);
  }

  async findPlanFactEntry(id: string) {
    const entity = await this.planFactRepository.findPlanFactEntryById(id);
    if (!entity) throw new NotFoundException(`Plan/fact entry with id "${id}" was not found.`);
    return entity;
  }

  async updatePlanFactEntry(id: string, dto: UpdatePlanFactEntryDto) {
    const updated = await this.planFactRepository.updatePlanFactEntry(id, dto);
    if (!updated) throw new NotFoundException(`Plan/fact entry with id "${id}" was not found.`);
    return updated;
  }

  async removePlanFactEntry(id: string) {
    await this.findPlanFactEntry(id);
    await this.planFactRepository.removePlanFactEntry(id);
  }

  getDashboardSummary(query: QueryDashboardSummaryDto) {
    return this.planFactRepository.getDashboardSummary(
      query as Record<string, unknown>,
    );
  }
}
