import { UserOrmEntity } from '../../infrastructure/persistence/user.orm-entity';

export interface UsersRepositoryInterface {
  create(entity: Partial<UserOrmEntity>): Promise<UserOrmEntity>;
  count(): Promise<number>;
  findAll(filters?: Record<string, unknown>): Promise<UserOrmEntity[]>;
  findOneById(id: string): Promise<UserOrmEntity | null>;
  findOneByEmail(email: string): Promise<UserOrmEntity | null>;
  update(
    id: string,
    payload: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity | null>;
  remove(id: string): Promise<void>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
