import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PLAN_FACT_REPOSITORY } from './domain/interfaces/plan-fact.repository.interface';
import { PlanFactService } from './application/services/plan-fact.service';
import { PlanFactEntryOrmEntity } from './infrastructure/persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from './infrastructure/persistence/service-line.orm-entity';
import { WorkOrderOrmEntity } from './infrastructure/persistence/work-order.orm-entity';
import { PlanFactRepository } from './infrastructure/repositories/plan-fact.repository';
import { PlanFactDashboardController } from './presentation/controllers/plan-fact-dashboard.controller';
import { PlanFactEntriesController } from './presentation/controllers/plan-fact-entries.controller';
import { ServiceLinesController } from './presentation/controllers/service-lines.controller';
import { WorkOrdersController } from './presentation/controllers/work-orders.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceLineOrmEntity,
      WorkOrderOrmEntity,
      PlanFactEntryOrmEntity,
    ]),
  ],
  controllers: [
    ServiceLinesController,
    WorkOrdersController,
    PlanFactEntriesController,
    PlanFactDashboardController,
  ],
  providers: [
    PlanFactService,
    PlanFactRepository,
    { provide: PLAN_FACT_REPOSITORY, useExisting: PlanFactRepository },
  ],
  exports: [PlanFactService, TypeOrmModule],
})
export class PlanFactModule {}
