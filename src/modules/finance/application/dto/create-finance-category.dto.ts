import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { FinanceCategoryType } from '../../domain/enums/finance-category-type.enum';

export class CreateFinanceCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: FinanceCategoryType, enumName: 'FinanceCategoryType' })
  @IsEnum(FinanceCategoryType)
  type: FinanceCategoryType;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
