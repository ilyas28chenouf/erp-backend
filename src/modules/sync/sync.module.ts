import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogsModule } from '../action-logs/action-logs.module';
import { AuthModule } from '../auth/auth.module';
import { CustomerOrmEntity } from '../customers/infrastructure/persistence/customer.orm-entity';
import { FinanceCategoryOrmEntity } from '../finance/infrastructure/persistence/finance-category.orm-entity';
import { FinanceSubcategoryOrmEntity } from '../finance/infrastructure/persistence/finance-subcategory.orm-entity';
import { PaymentRegistryEntryOrmEntity } from '../finance/infrastructure/persistence/payment-registry-entry.orm-entity';
import { PlanFactEntryOrmEntity } from '../plan-fact/infrastructure/persistence/plan-fact-entry.orm-entity';
import { ServiceLineOrmEntity } from '../plan-fact/infrastructure/persistence/service-line.orm-entity';
import { ProjectOrmEntity } from '../projects/infrastructure/persistence/project.orm-entity';
import { ProdApiService } from './prod-api.service';
import { SyncController } from './sync.controller';
import { SyncHandlersService } from './sync-handlers.service';
import { SyncService } from './sync.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    ActionLogsModule,
    TypeOrmModule.forFeature([
      CustomerOrmEntity,
      ProjectOrmEntity,
      ServiceLineOrmEntity,
      PlanFactEntryOrmEntity,
      FinanceCategoryOrmEntity,
      FinanceSubcategoryOrmEntity,
      PaymentRegistryEntryOrmEntity,
    ]),
  ],
  controllers: [SyncController],
  providers: [SyncService, ProdApiService, SyncHandlersService],
  exports: [SyncService],
})
export class SyncModule {}
