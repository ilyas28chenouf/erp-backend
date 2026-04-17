import { AuditLogOrmEntity } from '../../infrastructure/persistence/audit-log.orm-entity';

export interface AuditRepositoryInterface {
  create(entity: Partial<AuditLogOrmEntity>): Promise<AuditLogOrmEntity>;
  findAll(filters?: Record<string, unknown>): Promise<AuditLogOrmEntity[]>;
  findOneById(id: string): Promise<AuditLogOrmEntity | null>;
  update(
    id: string,
    payload: Partial<AuditLogOrmEntity>,
  ): Promise<AuditLogOrmEntity | null>;
  remove(id: string): Promise<void>;
}

export const AUDIT_REPOSITORY = Symbol('AUDIT_REPOSITORY');
