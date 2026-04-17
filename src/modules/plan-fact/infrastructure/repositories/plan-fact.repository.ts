import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDashboardSummaryDto } from '../../application/dto/query-dashboard-summary.dto';
import { QueryPlanFactEntriesDto } from '../../application/dto/query-plan-fact-entries.dto';
import { QueryServiceLinesDto } from '../../application/dto/query-service-lines.dto';
import { QueryWorkOrdersDto } from '../../application/dto/query-work-orders.dto';
import { PlanFactRepositoryInterface } from '../../domain/interfaces/plan-fact.repository.interface';
import { PlanFactEntryOrmEntity } from '../persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from '../persistence/service-line.orm-entity';
import { WorkOrderOrmEntity } from '../persistence/work-order.orm-entity';

@Injectable()
export class PlanFactRepository implements PlanFactRepositoryInterface {
  constructor(
    @InjectRepository(ServiceLineOrmEntity)
    private readonly serviceLinesRepository: Repository<ServiceLineOrmEntity>,
    @InjectRepository(WorkOrderOrmEntity)
    private readonly workOrdersRepository: Repository<WorkOrderOrmEntity>,
    @InjectRepository(PlanFactEntryOrmEntity)
    private readonly planFactEntriesRepository: Repository<PlanFactEntryOrmEntity>,
  ) {}

  createServiceLine(entity: Partial<ServiceLineOrmEntity>) {
    return this.serviceLinesRepository.save(this.serviceLinesRepository.create(entity));
  }

  findServiceLines(filters?: QueryServiceLinesDto) {
    return this.serviceLinesRepository.find({
      where: {
        customerId: filters?.customerId,
        projectId: filters?.projectId,
        isActive: filters?.isActive,
      },
      relations: { customer: true, project: true, workOrders: true, planFactEntries: true },
      order: { createdAt: 'DESC' },
    });
  }

  findServiceLineById(id: string) {
    return this.serviceLinesRepository.findOne({
      where: { id },
      relations: { customer: true, project: true, workOrders: true, planFactEntries: true },
    });
  }

  async updateServiceLine(id: string, payload: Partial<ServiceLineOrmEntity>) {
    const existing = await this.findServiceLineById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.serviceLinesRepository.save(existing);
  }

  async removeServiceLine(id: string) {
    await this.serviceLinesRepository.delete(id);
  }

  createWorkOrder(entity: Partial<WorkOrderOrmEntity>) {
    return this.workOrdersRepository.save(this.workOrdersRepository.create(entity));
  }

  findWorkOrders(filters?: QueryWorkOrdersDto) {
    return this.workOrdersRepository.find({
      where: {
        serviceLineId: filters?.serviceLineId,
        year: filters?.year,
        month: filters?.month,
      },
      relations: { serviceLine: true, planFactEntries: true },
      order: { createdAt: 'DESC' },
    });
  }

  findWorkOrderById(id: string) {
    return this.workOrdersRepository.findOne({
      where: { id },
      relations: { serviceLine: true, planFactEntries: true },
    });
  }

  async updateWorkOrder(id: string, payload: Partial<WorkOrderOrmEntity>) {
    const existing = await this.findWorkOrderById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.workOrdersRepository.save(existing);
  }

  async removeWorkOrder(id: string) {
    await this.workOrdersRepository.delete(id);
  }

  createPlanFactEntry(entity: Partial<PlanFactEntryOrmEntity>) {
    return this.planFactEntriesRepository.save(this.planFactEntriesRepository.create(entity));
  }

  async findPlanFactEntries(filters?: QueryPlanFactEntriesDto) {
    const qb = this.planFactEntriesRepository
      .createQueryBuilder('entry')
      .leftJoinAndSelect('entry.serviceLine', 'serviceLine')
      .leftJoinAndSelect('entry.workOrder', 'workOrder')
      .leftJoinAndSelect('serviceLine.customer', 'customer')
      .leftJoinAndSelect('serviceLine.project', 'project')
      .orderBy('entry.createdAt', 'DESC');

    if (filters?.serviceLineId) qb.andWhere('entry.serviceLineId = :serviceLineId', { serviceLineId: filters.serviceLineId });
    if (filters?.workOrderId) qb.andWhere('entry.workOrderId = :workOrderId', { workOrderId: filters.workOrderId });
    if (filters?.customerId) qb.andWhere('serviceLine.customerId = :customerId', { customerId: filters.customerId });
    if (filters?.projectId) qb.andWhere('serviceLine.projectId = :projectId', { projectId: filters.projectId });
    if (typeof filters?.year === 'number') qb.andWhere('entry.year = :year', { year: filters.year });
    if (typeof filters?.month === 'number') qb.andWhere('entry.month = :month', { month: filters.month });

    return qb.getMany();
  }

  findPlanFactEntryById(id: string) {
    return this.planFactEntriesRepository.findOne({
      where: { id },
      relations: { serviceLine: { customer: true, project: true }, workOrder: true },
    });
  }

  async updatePlanFactEntry(id: string, payload: Partial<PlanFactEntryOrmEntity>) {
    const existing = await this.findPlanFactEntryById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.planFactEntriesRepository.save(existing);
  }

  async removePlanFactEntry(id: string) {
    await this.planFactEntriesRepository.delete(id);
  }

  async getDashboardSummary(filters?: QueryDashboardSummaryDto) {
    const entriesQb = this.planFactEntriesRepository
      .createQueryBuilder('entry')
      .leftJoin('entry.serviceLine', 'serviceLine');

    if (filters?.customerId) entriesQb.andWhere('serviceLine.customerId = :customerId', { customerId: filters.customerId });
    if (filters?.projectId) entriesQb.andWhere('serviceLine.projectId = :projectId', { projectId: filters.projectId });
    if (typeof filters?.year === 'number') entriesQb.andWhere('entry.year = :year', { year: filters.year });
    if (typeof filters?.month === 'number') entriesQb.andWhere('entry.month = :month', { month: filters.month });

    const totalsRow = await entriesQb
      .select('COALESCE(SUM(entry.naradPlan), 0)', 'totalNaradPlan')
      .addSelect('COALESCE(SUM(entry.naradFact), 0)', 'totalNaradFact')
      .addSelect('COALESCE(SUM(entry.advancePlan), 0)', 'totalAdvancePlan')
      .addSelect('COALESCE(SUM(entry.advanceFact), 0)', 'totalAdvanceFact')
      .getRawOne<{
        totalNaradPlan: string;
        totalNaradFact: string;
        totalAdvancePlan: string;
        totalAdvanceFact: string;
      }>();

    const serviceLinesQb = this.serviceLinesRepository.createQueryBuilder('serviceLine');
    if (filters?.customerId) serviceLinesQb.andWhere('serviceLine.customerId = :customerId', { customerId: filters.customerId });
    if (filters?.projectId) serviceLinesQb.andWhere('serviceLine.projectId = :projectId', { projectId: filters.projectId });

    const totalProjects = await serviceLinesQb.clone().select('COUNT(DISTINCT serviceLine.projectId)', 'count').where('serviceLine.projectId IS NOT NULL').getRawOne<{ count: string }>();
    const activeProjects = await serviceLinesQb.clone().select('COUNT(DISTINCT serviceLine.projectId)', 'count').where('serviceLine.projectId IS NOT NULL').andWhere('serviceLine.isActive = :isActive', { isActive: true }).getRawOne<{ count: string }>();

    const totalNaradPlan = Number(totalsRow?.totalNaradPlan ?? 0);
    const totalNaradFact = Number(totalsRow?.totalNaradFact ?? 0);
    const totalAdvancePlan = Number(totalsRow?.totalAdvancePlan ?? 0);
    const totalAdvanceFact = Number(totalsRow?.totalAdvanceFact ?? 0);

    return {
      totalProjects: Number(totalProjects?.count ?? 0),
      activeProjects: Number(activeProjects?.count ?? 0),
      totalNaradPlan,
      totalNaradFact,
      totalAdvancePlan,
      totalAdvanceFact,
      totalDeviation: totalNaradFact + totalAdvanceFact - totalNaradPlan - totalAdvancePlan,
    };
  }
}
