import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  create(dto: CreateCustomerDto) {
    return this.customersRepository.create(dto);
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
    const updated = await this.customersRepository.update(id, dto);
    if (!updated) throw new NotFoundException(`Customer with id "${id}" was not found.`);
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.customersRepository.remove(id);
  }
}
