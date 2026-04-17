import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUDIT_REPOSITORY } from '../../domain/interfaces/audit.repository.interface';
import type { AuditRepositoryInterface } from '../../domain/interfaces/audit.repository.interface';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { QueryAuditLogsDto } from '../dto/query-audit-logs.dto';
import { UpdateAuditLogDto } from '../dto/update-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: AuditRepositoryInterface,
  ) {}

  create(dto: CreateAuditLogDto) {
    return this.auditRepository.create(dto);
  }

  findAll(query: QueryAuditLogsDto) {
    return this.auditRepository.findAll(query as Record<string, unknown>);
  }

  async findOne(id: string) {
    const entity = await this.auditRepository.findOneById(id);
    if (!entity) throw new NotFoundException(`Audit log with id "${id}" was not found.`);
    return entity;
  }

  async update(id: string, dto: UpdateAuditLogDto) {
    const updated = await this.auditRepository.update(id, dto);
    if (!updated) throw new NotFoundException(`Audit log with id "${id}" was not found.`);
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.auditRepository.remove(id);
  }
}
