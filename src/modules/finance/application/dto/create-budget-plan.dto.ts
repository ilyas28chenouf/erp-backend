import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBudgetPlanDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsInt()
  @Min(2000)
  @Max(3000)
  periodYear: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  periodMonth: number;

  @ApiProperty({ example: '50000.00' })
  @IsNumberString()
  plannedAmount: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
