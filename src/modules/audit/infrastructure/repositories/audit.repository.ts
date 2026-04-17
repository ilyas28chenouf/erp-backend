import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryAuditLogsDto } from '../../application/dto/query-audit-logs.dto';
import { AuditRepositoryInterface } from '../../domain/interfaces/audit.repository.interface';
import { AuditLogOrmEntity } from '../persistence/audit-log.orm-entity';

@Injectable()
export class AuditRepository implements AuditRepositoryInterface {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogsRepository: Repository<AuditLogOrmEntity>,
  ) {}

  create(entity: Partial<AuditLogOrmEntity>) {
    return this.auditLogsRepository.save(this.auditLogsRepository.create(entity));
  }

  findAll(filters?: QueryAuditLogsDto) {
    return this.auditLogsRepository.find({
      where: {
        entityType: filters?.entityType,
        entityId: filters?.entityId,
        action: filters?.action,
        actorUserId: filters?.actorUserId,
      },
      relations: { actorUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOneById(id: string) {
    return this.auditLogsRepository.findOne({
      where: { id },
      relations: { actorUser: true },
    });
  }

  async update(id: string, payload: Partial<AuditLogOrmEntity>) {
    const existing = await this.findOneById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.auditLogsRepository.save(existing);
  }

  async remove(id: string) {
    await this.auditLogsRepository.delete(id);
  }
}
