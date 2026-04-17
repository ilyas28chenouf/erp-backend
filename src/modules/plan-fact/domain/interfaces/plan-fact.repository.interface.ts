import { PlanFactEntryOrmEntity } from '../../infrastructure/persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from '../../infrastructure/persistence/service-line.orm-entity';
import { WorkOrderOrmEntity } from '../../infrastructure/persistence/work-order.orm-entity';

export interface PlanFactRepositoryInterface {
  createServiceLine(entity: Partial<ServiceLineOrmEntity>): Promise<ServiceLineOrmEntity>;
  findServiceLines(filters?: Record<string, unknown>): Promise<ServiceLineOrmEntity[]>;
  findServiceLineById(id: string): Promise<ServiceLineOrmEntity | null>;
  updateServiceLine(
    id: string,
    payload: Partial<ServiceLineOrmEntity>,
  ): Promise<ServiceLineOrmEntity | null>;
  removeServiceLine(id: string): Promise<void>;
  createWorkOrder(entity: Partial<WorkOrderOrmEntity>): Promise<WorkOrderOrmEntity>;
  findWorkOrders(filters?: Record<string, unknown>): Promise<WorkOrderOrmEntity[]>;
  findWorkOrderById(id: string): Promise<WorkOrderOrmEntity | null>;
  updateWorkOrder(
    id: string,
    payload: Partial<WorkOrderOrmEntity>,
  ): Promise<WorkOrderOrmEntity | null>;
  removeWorkOrder(id: string): Promise<void>;
  createPlanFactEntry(entity: Partial<PlanFactEntryOrmEntity>): Promise<PlanFactEntryOrmEntity>;
  findPlanFactEntries(
    filters?: Record<string, unknown>,
  ): Promise<PlanFactEntryOrmEntity[]>;
  findPlanFactEntryById(id: string): Promise<PlanFactEntryOrmEntity | null>;
  updatePlanFactEntry(
    id: string,
    payload: Partial<PlanFactEntryOrmEntity>,
  ): Promise<PlanFactEntryOrmEntity | null>;
  removePlanFactEntry(id: string): Promise<void>;
  getDashboardSummary(filters?: Record<string, unknown>): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalNaradPlan: number;
    totalNaradFact: number;
    totalAdvancePlan: number;
    totalAdvanceFact: number;
    totalDeviation: number;
  }>;
}

export const PLAN_FACT_REPOSITORY = Symbol('PLAN_FACT_REPOSITORY');
