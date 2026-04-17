import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUDIT_REPOSITORY } from './domain/interfaces/audit.repository.interface';
import { AuditService } from './application/services/audit.service';
import { AuditLogOrmEntity } from './infrastructure/persistence/audit-log.orm-entity';
import { AuditRepository } from './infrastructure/repositories/audit.repository';
import { AuditController } from './presentation/controllers/audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditRepository,
    { provide: AUDIT_REPOSITORY, useExisting: AuditRepository },
  ],
  exports: [AuditService, TypeOrmModule],
})
export class AuditModule {}
