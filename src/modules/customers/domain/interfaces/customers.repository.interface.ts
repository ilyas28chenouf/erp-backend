import { CustomerOrmEntity } from '../../infrastructure/persistence/customer.orm-entity';

export interface CustomersRepositoryInterface {
  create(entity: Partial<CustomerOrmEntity>): Promise<CustomerOrmEntity>;
  findAll(filters?: Record<string, unknown>): Promise<CustomerOrmEntity[]>;
  findOneById(id: string): Promise<CustomerOrmEntity | null>;
  update(
    id: string,
    payload: Partial<CustomerOrmEntity>,
  ): Promise<CustomerOrmEntity | null>;
  remove(id: string): Promise<void>;
}

export const CUSTOMERS_REPOSITORY = Symbol('CUSTOMERS_REPOSITORY');
