import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ActionLogActionType } from '../domain/enums/action-log-action-type.enum';
import { ActionLogSource } from '../domain/enums/action-log-source.enum';
import { ActionLogSyncStatus } from '../domain/enums/action-log-sync-status.enum';

export class QueryActionLogsDto {
  @ApiPropertyOptional({ example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2026-05-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @ApiPropertyOptional({ enum: ActionLogActionType })
  @IsOptional()
  @IsEnum(ActionLogActionType)
  actionType?: ActionLogActionType;

  @ApiPropertyOptional({ example: 'DOCUMENT' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ enum: ActionLogSource })
  @IsOptional()
  @IsEnum(ActionLogSource)
  source?: ActionLogSource;

  @ApiPropertyOptional({ enum: ActionLogSyncStatus })
  @IsOptional()
  @IsEnum(ActionLogSyncStatus)
  syncStatus?: ActionLogSyncStatus;

  @ApiPropertyOptional({ default: 100, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}
