import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseUuidEntity } from '../../../../common/base.entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { ActionLogActionType } from '../../domain/enums/action-log-action-type.enum';
import { ActionLogSource } from '../../domain/enums/action-log-source.enum';
import { ActionLogSyncStatus } from '../../domain/enums/action-log-sync-status.enum';

@Entity({ name: 'action_logs' })
@Index(['entityType', 'entityId'])
@Index(['createdAt'])
export class ActionLogOrmEntity extends BaseUuidEntity {
  @ApiProperty()
  @Index()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  actionDate: Date;

  @ApiProperty({ nullable: true })
  @Index()
  @Column({ type: 'uuid', nullable: true })
  actorUserId?: string | null;

  @ApiProperty({ enum: ActionLogActionType, enumName: 'ActionLogActionType' })
  @Column({ type: 'enum', enum: ActionLogActionType })
  actionType: ActionLogActionType;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  entityType: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  entityId?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  entityLabel?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  @Column({ type: 'jsonb', nullable: true })
  beforeData?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  @Column({ type: 'jsonb', nullable: true })
  afterData?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress?: string | null;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  userAgent?: string | null;

  @ApiProperty({ enum: ActionLogSource, enumName: 'ActionLogSource' })
  @Column({
    type: 'enum',
    enum: ActionLogSource,
    default: ActionLogSource.ERP_BACKEND,
  })
  source: ActionLogSource;

  @ApiProperty({ enum: ActionLogSyncStatus, enumName: 'ActionLogSyncStatus' })
  @Index()
  @Column({
    type: 'enum',
    enum: ActionLogSyncStatus,
    default: ActionLogSyncStatus.PENDING,
  })
  syncStatus: ActionLogSyncStatus;

  @ApiProperty({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  syncedAt?: Date | null;

  @ManyToOne(() => UserOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actorUserId' })
  actorUser?: UserOrmEntity | null;
}
