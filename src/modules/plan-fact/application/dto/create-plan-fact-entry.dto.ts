import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreatePlanFactEntryDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  serviceLineId: string;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  documentId?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  documentActId?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  documentNaradId?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  documentOtherId?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  workOrderId?: string | null;

  @ApiProperty()
  @IsInt()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  weekLabel?: string | null;

  @ApiProperty({ required: false, example: '0.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  naradPlan?: string;

  @ApiProperty({ required: false, example: '0.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  naradFact?: string;

  @ApiProperty({ required: false, example: '0.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  advancePlan?: string;

  @ApiProperty({ required: false, example: '0.00', default: '0.00' })
  @IsOptional()
  @IsNumberString()
  advanceFact?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
