import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { AuditAction } from '../../domain/enums/audit-action.enum';

export class CreateAuditLogDto {
  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ enum: AuditAction, enumName: 'AuditAction' })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  actorUserId?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: Object,
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown> | null;
}
