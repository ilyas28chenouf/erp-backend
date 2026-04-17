import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  assigneeUserId?: string | null;

  @ApiProperty({ required: false, nullable: true, type: String, format: 'date' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date | null;

  @ApiProperty({ required: false, enum: TaskStatus, enumName: 'TaskStatus', default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ required: false, enum: TaskPriority, enumName: 'TaskPriority', default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;
}
