import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { QueryCustomersDto } from '../../application/dto/query-customers.dto';
import { CustomersRepositoryInterface } from '../../domain/interfaces/customers.repository.interface';
import { CustomerOrmEntity } from '../persistence/customer.orm-entity';

@Injectable()
export class CustomersRepository implements CustomersRepositoryInterface {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customersRepository: Repository<CustomerOrmEntity>,
  ) {}

  create(entity: Partial<CustomerOrmEntity>) {
    return this.customersRepository.save(this.customersRepository.create(entity));
  }

  findAll(filters?: QueryCustomersDto) {
    const where: FindOptionsWhere<CustomerOrmEntity> = {};
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (filters?.status) where.status = ILike(`%${filters.status}%`);
    return this.customersRepository.find({
      where,
      relations: { serviceLines: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOneById(id: string) {
    return this.customersRepository.findOne({
      where: { id },
      relations: { serviceLines: true },
    });
  }

  async update(id: string, payload: Partial<CustomerOrmEntity>) {
    const existing = await this.findOneById(id);
    if (!existing) return null;
    Object.assign(existing, payload);
    return this.customersRepository.save(existing);
  }

  async remove(id: string) {
    await this.customersRepository.delete(id);
  }
}
