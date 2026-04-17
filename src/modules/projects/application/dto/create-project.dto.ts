import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from '../../domain/enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  clientName: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  location?: string | null;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date | null;

  @ApiProperty({
    required: false,
    enum: ProjectStatus,
    enumName: 'ProjectStatus',
    default: ProjectStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  responsibleUserId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}
