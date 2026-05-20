import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogsModule } from '../action-logs/action-logs.module';
import { CUSTOMERS_REPOSITORY } from './domain/interfaces/customers.repository.interface';
import { CustomersService } from './application/services/customers.service';
import { CustomerOrmEntity } from './infrastructure/persistence/customer.orm-entity';
import { CustomersRepository } from './infrastructure/repositories/customers.repository';
import { CustomersController } from './presentation/controllers/customers.controller';

@Module({
  imports: [ActionLogsModule, TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CustomersRepository,
    { provide: CUSTOMERS_REPOSITORY, useExisting: CustomersRepository },
  ],
  exports: [CustomersService, TypeOrmModule],
})
export class CustomersModule {}
