import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CreatedAtOnlyEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { AuditAction } from '../../domain/enums/audit-action.enum';

@Entity({ name: 'audit_logs' })
export class AuditLogOrmEntity extends CreatedAtOnlyEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  entityType: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  entityId: string;

  @ApiProperty({ enum: AuditAction, enumName: 'AuditAction' })
  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @ApiProperty({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  actorUserId?: string | null;

  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown> | null;

  @ManyToOne(() => UserOrmEntity, (user) => user.auditLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actorUserId' })
  actorUser?: UserOrmEntity | null;
}
