import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ActionLogActionType } from '../domain/enums/action-log-action-type.enum';
import { ActionLogSource } from '../domain/enums/action-log-source.enum';
import { ActionLogSyncStatus } from '../domain/enums/action-log-sync-status.enum';

export class CreateActionLogDto {
  @ApiPropertyOptional({ example: '2026-05-20T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  actionDate?: string;

  @ApiPropertyOptional({ example: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  actorUserId?: string | null;

  @ApiProperty({ enum: ActionLogActionType, example: ActionLogActionType.CREATE })
  @IsEnum(ActionLogActionType)
  actionType: ActionLogActionType;

  @ApiProperty({ example: 'DOCUMENT' })
  @IsString()
  @MaxLength(100)
  entityType: string;

  @ApiPropertyOptional({ example: 'uuid', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  entityId?: string | null;

  @ApiPropertyOptional({ example: 'Contract 2026.pdf', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  entityLabel?: string | null;

  @ApiPropertyOptional({ example: 'Document was created.', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ nullable: true, type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  beforeData?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  afterData?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({ example: '127.0.0.1', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ipAddress?: string | null;

  @ApiPropertyOptional({ example: 'Mozilla/5.0', nullable: true })
  @IsOptional()
  @IsString()
  userAgent?: string | null;

  @ApiPropertyOptional({ enum: ActionLogSource, example: ActionLogSource.ERP_BACKEND })
  @IsOptional()
  @IsEnum(ActionLogSource)
  source?: ActionLogSource;

  @ApiPropertyOptional({ enum: ActionLogSyncStatus, example: ActionLogSyncStatus.PENDING })
  @IsOptional()
  @IsEnum(ActionLogSyncStatus)
  syncStatus?: ActionLogSyncStatus;
}
