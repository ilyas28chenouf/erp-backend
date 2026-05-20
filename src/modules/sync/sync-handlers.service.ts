import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionLogActionType } from '../action-logs/domain/enums/action-log-action-type.enum';
import { ActionLogOrmEntity } from '../action-logs/infrastructure/persistence/action-log.orm-entity';
import { CustomerOrmEntity } from '../customers/infrastructure/persistence/customer.orm-entity';
import { FinanceCategoryOrmEntity } from '../finance/infrastructure/persistence/finance-category.orm-entity';
import { FinanceSubcategoryOrmEntity } from '../finance/infrastructure/persistence/finance-subcategory.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { PlanFactEntryOrmEntity } from '../plan-fact/infrastructure/persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from '../plan-fact/infrastructure/persistence/service-line.orm-entity';
import { ProjectOrmEntity } from '../projects/infrastructure/persistence/project.orm-entity';

type HandlerResult =
  | { status: 'synced' }
  | { status: 'ignored'; reason: string }
  | { status: 'failed'; reason: string };

type SyncRepository = Pick<
  Repository<SupportedEntity>,
  'create' | 'delete' | 'save'
>;

type SupportedEntity =
  | CustomerOrmEntity
  | ProjectOrmEntity
  | ServiceLineOrmEntity
  | PlanFactEntryOrmEntity
  | FinanceCategoryOrmEntity
  | FinanceSubcategoryOrmEntity
  | PaymentRegistryEntryOrmEntity;

@Injectable()
export class SyncHandlersService {
  private readonly repositoryMap: Record<string, SyncRepository>;

  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customersRepository: Repository<CustomerOrmEntity>,
    @InjectRepository(ProjectOrmEntity)
    private readonly projectsRepository: Repository<ProjectOrmEntity>,
    @InjectRepository(ServiceLineOrmEntity)
    private readonly serviceLinesRepository: Repository<ServiceLineOrmEntity>,
    @InjectRepository(PlanFactEntryOrmEntity)
    private readonly planFactEntriesRepository: Repository<PlanFactEntryOrmEntity>,
    @InjectRepository(FinanceCategoryOrmEntity)
    private readonly financeCategoriesRepository: Repository<FinanceCategoryOrmEntity>,
    @InjectRepository(FinanceSubcategoryOrmEntity)
    private readonly financeSubcategoriesRepository: Repository<FinanceSubcategoryOrmEntity>,
    @InjectRepository(PaymentRegistryEntryOrmEntity)
    private readonly paymentRegistryEntriesRepository: Repository<PaymentRegistryEntryOrmEntity>,
  ) {
    this.repositoryMap = {
      CUSTOMER: this.customersRepository as unknown as SyncRepository,
      PROJECT: this.projectsRepository as unknown as SyncRepository,
      SERVICE_LINE: this.serviceLinesRepository as unknown as SyncRepository,
      PLAN_FACT_ENTRY: this.planFactEntriesRepository as unknown as SyncRepository,
      FINANCE_CATEGORY: this.financeCategoriesRepository as unknown as SyncRepository,
      FINANCE_SUBCATEGORY: this.financeSubcategoriesRepository as unknown as SyncRepository,
      PAYMENT_REGISTRY_ENTRY:
        this.paymentRegistryEntriesRepository as unknown as SyncRepository,
    };
  }

  async apply(log: ActionLogOrmEntity): Promise<HandlerResult> {
    const repository = this.repositoryMap[log.entityType];

    if (!repository) {
      return {
        status: 'ignored',
        reason: `Unsupported entity type: ${log.entityType}`,
      };
    }

    if (
      log.actionType !== ActionLogActionType.CREATE &&
      log.actionType !== ActionLogActionType.UPDATE &&
      log.actionType !== ActionLogActionType.DELETE
    ) {
      return {
        status: 'ignored',
        reason: `Unsupported action type: ${log.actionType}`,
      };
    }

    if (log.actionType === ActionLogActionType.DELETE) {
      const entityId = log.entityId ?? this.getPayloadId(log.beforeData);
      if (!entityId) {
        return { status: 'failed', reason: 'Missing entity id for delete.' };
      }

      await repository.delete(entityId);
      return { status: 'synced' };
    }

    const afterData = this.stripRelations(log.afterData);
    const entityId = log.entityId ?? this.getPayloadId(afterData);

    if (!entityId) {
      return { status: 'failed', reason: 'Missing entity id for upsert.' };
    }

    const dependencyError = await this.validateDependencies(
      log.entityType,
      afterData,
    );

    if (dependencyError) {
      return { status: 'failed', reason: dependencyError };
    }

    // TODO: conflict resolution will be added later. First version uses remote last-write-wins.
    await repository.save(repository.create({ ...afterData, id: entityId }));
    return { status: 'synced' };
  }

  private async validateDependencies(entityType: string, data: Record<string, unknown>) {
    if (entityType === 'SERVICE_LINE') {
      if (
        data.customerId &&
        !(await this.customersRepository.exist({ where: { id: String(data.customerId) } }))
      ) {
        return `Missing dependency: CUSTOMER ${data.customerId}`;
      }

      if (
        data.projectId &&
        !(await this.projectsRepository.exist({ where: { id: String(data.projectId) } }))
      ) {
        return `Missing dependency: PROJECT ${data.projectId}`;
      }
    }

    if (entityType === 'PLAN_FACT_ENTRY') {
      if (
        data.serviceLineId &&
        !(await this.serviceLinesRepository.exist({
          where: { id: String(data.serviceLineId) },
        }))
      ) {
        return `Missing dependency: SERVICE_LINE ${data.serviceLineId}`;
      }
    }

    if (entityType === 'FINANCE_SUBCATEGORY') {
      if (
        data.categoryId &&
        !(await this.financeCategoriesRepository.exist({
          where: { id: String(data.categoryId) },
        }))
      ) {
        return `Missing dependency: FINANCE_CATEGORY ${data.categoryId}`;
      }
    }

    if (entityType === 'PAYMENT_REGISTRY_ENTRY') {
      if (
        data.subcategoryId &&
        !(await this.financeSubcategoriesRepository.exist({
          where: { id: String(data.subcategoryId) },
        }))
      ) {
        return `Missing dependency: FINANCE_SUBCATEGORY ${data.subcategoryId}`;
      }
    }

    return null;
  }

  private getPayloadId(data: unknown) {
    if (typeof data !== 'object' || data === null) {
      return null;
    }

    return String((data as Record<string, unknown>).id ?? '') || null;
  }

  private stripRelations(data: unknown): Record<string, unknown> {
    if (typeof data !== 'object' || data === null) {
      return {};
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (this.isRelationValue(value)) {
        continue;
      }

      result[key] = value;
    }

    return result;
  }

  private isRelationValue(value: unknown) {
    if (Array.isArray(value)) {
      return true;
    }

    return typeof value === 'object' && value !== null;
  }
}
