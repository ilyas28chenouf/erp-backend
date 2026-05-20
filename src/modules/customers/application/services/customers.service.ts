import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ActionLogsService } from '../../../action-logs/action-logs.service';
import { CUSTOMERS_REPOSITORY } from '../../domain/interfaces/customers.repository.interface';
import type { CustomersRepositoryInterface } from '../../domain/interfaces/customers.repository.interface';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { QueryCustomersDto } from '../dto/query-customers.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @Inject(CUSTOMERS_REPOSITORY)
    private readonly customersRepository: CustomersRepositoryInterface,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(dto: CreateCustomerDto) {
    const created = await this.customersRepository.create(dto);
    await this.actionLogsService.logCreate({
      entityType: 'CUSTOMER',
      entityId: created.id,
      entityLabel: created.name,
      description: 'Customer created.',
      afterData: created,
    });

    return created;
  }

  findAll(query: QueryCustomersDto) {
    return this.customersRepository.findAll(query as Record<string, unknown>);
  }

  async findOne(id: string) {
    const entity = await this.customersRepository.findOneById(id);
    if (!entity) throw new NotFoundException(`Customer with id "${id}" was not found.`);
    return entity;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const existing = await this.findOne(id);
    const updated = await this.customersRepository.update(id, dto);
    if (!updated) throw new NotFoundException(`Customer with id "${id}" was not found.`);
    await this.actionLogsService.logUpdate({
      entityType: 'CUSTOMER',
      entityId: updated.id,
      entityLabel: updated.name,
      description: 'Customer updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    await this.customersRepository.remove(id);
    await this.actionLogsService.logDelete({
      entityType: 'CUSTOMER',
      entityId: existing.id,
      entityLabel: existing.name,
      description: 'Customer deleted.',
      beforeData: existing,
    });
  }
}
