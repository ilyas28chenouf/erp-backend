import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogOrmEntity } from '../audit/infrastructure/persistence/audit-log.orm-entity';
import { DocumentOrmEntity } from '../documents/infrastructure/persistence/document.orm-entity';
import { BudgetPlanOrmEntity } from '../finance/infrastructure/persistence/budget-plan.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { ProjectOrmEntity } from '../projects/infrastructure/persistence/project.orm-entity';
import { TaskOrmEntity } from '../tasks/infrastructure/persistence/task.orm-entity';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { ReportsService } from './application/services/reports.service';
import { ReportsController } from './presentation/controllers/reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      ProjectOrmEntity,
      TaskOrmEntity,
      DocumentOrmEntity,
      PaymentRegistryEntryOrmEntity,
      BudgetPlanOrmEntity,
      AuditLogOrmEntity,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
