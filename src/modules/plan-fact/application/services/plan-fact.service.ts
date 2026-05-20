import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActionLogsService } from '../../../action-logs/action-logs.service';
import { DocumentsService } from '../../../documents/application/services/documents.service';
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
    private readonly documentsService: DocumentsService,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async createServiceLine(dto: CreateServiceLineDto) {
    const created = await this.planFactRepository.createServiceLine({
      ...dto,
      isActive: dto.isActive ?? true,
    });
    await this.actionLogsService.logCreate({
      entityType: 'SERVICE_LINE',
      entityId: created.id,
      entityLabel: created.title,
      description: 'Service line created.',
      afterData: created,
    });

    return created;
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
    const existing = await this.findServiceLine(id);
    const updated = await this.planFactRepository.updateServiceLine(id, dto);
    if (!updated) throw new NotFoundException(`Service line with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'SERVICE_LINE',
      entityId: updated.id,
      entityLabel: updated.title,
      description: 'Service line updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async removeServiceLine(id: string) {
    const existing = await this.findServiceLine(id);
    await this.planFactRepository.removeServiceLine(id);
    await this.actionLogsService.logDelete({
      entityType: 'SERVICE_LINE',
      entityId: existing.id,
      entityLabel: existing.title,
      description: 'Service line deleted.',
      beforeData: existing,
    });
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

  async createPlanFactEntry(dto: CreatePlanFactEntryDto) {
    await this.validateAttachedDocuments(dto);

    const created = await this.planFactRepository.createPlanFactEntry({
      ...dto,
      naradPlan: dto.naradPlan ?? '0.00',
      naradFact: dto.naradFact ?? '0.00',
      advancePlan: dto.advancePlan ?? '0.00',
      advanceFact: dto.advanceFact ?? '0.00',
    });
    await this.actionLogsService.logCreate({
      entityType: 'PLAN_FACT_ENTRY',
      entityId: created.id,
      entityLabel: created.weekLabel ?? null,
      description: 'Plan/fact entry created.',
      afterData: created,
    });

    return created;
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
    await this.validateAttachedDocuments(dto);

    const existing = await this.findPlanFactEntry(id);
    const updated = await this.planFactRepository.updatePlanFactEntry(id, dto);
    if (!updated) throw new NotFoundException(`Plan/fact entry with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'PLAN_FACT_ENTRY',
      entityId: updated.id,
      entityLabel: updated.weekLabel ?? null,
      description: 'Plan/fact entry updated.',
      beforeData: existing,
      afterData: updated,
      metadata: {
        documentId: updated.documentId ?? null,
        documentActId: updated.documentActId ?? null,
        documentNaradId: updated.documentNaradId ?? null,
        documentOtherId: updated.documentOtherId ?? null,
      },
    });
    return updated;
  }

  async removePlanFactEntry(id: string) {
    const existing = await this.findPlanFactEntry(id);
    await this.planFactRepository.removePlanFactEntry(id);
    await this.actionLogsService.logDelete({
      entityType: 'PLAN_FACT_ENTRY',
      entityId: existing.id,
      entityLabel: existing.weekLabel ?? null,
      description: 'Plan/fact entry deleted.',
      beforeData: existing,
    });
  }

  getDashboardSummary(query: QueryDashboardSummaryDto) {
    return this.planFactRepository.getDashboardSummary(
      query as Record<string, unknown>,
    );
  }

  private async validateAttachedDocuments(
    dto: Pick<
      CreatePlanFactEntryDto,
      'documentId' | 'documentActId' | 'documentNaradId' | 'documentOtherId'
    >,
  ) {
    const documentIds = [
      dto.documentId,
      dto.documentActId,
      dto.documentNaradId,
      dto.documentOtherId,
    ].filter((documentId): documentId is string => Boolean(documentId));

    await Promise.all(
      documentIds.map((documentId) => this.documentsService.findDocument(documentId)),
    );
  }
}
