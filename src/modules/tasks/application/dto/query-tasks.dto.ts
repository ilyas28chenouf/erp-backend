import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

export class QueryTasksDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeUserId?: string;

  @ApiPropertyOptional({ enum: TaskStatus, enumName: 'TaskStatus' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, enumName: 'TaskPriority' })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
