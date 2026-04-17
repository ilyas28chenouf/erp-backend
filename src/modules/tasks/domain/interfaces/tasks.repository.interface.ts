import { TaskOrmEntity } from '../../infrastructure/persistence/task.orm-entity';

export interface TasksRepositoryInterface {
  create(entity: Partial<TaskOrmEntity>): Promise<TaskOrmEntity>;
  findAll(filters?: Record<string, unknown>): Promise<TaskOrmEntity[]>;
  findOneById(id: string): Promise<TaskOrmEntity | null>;
  update(id: string, payload: Partial<TaskOrmEntity>): Promise<TaskOrmEntity | null>;
  remove(id: string): Promise<void>;
}

export const TASKS_REPOSITORY = Symbol('TASKS_REPOSITORY');
