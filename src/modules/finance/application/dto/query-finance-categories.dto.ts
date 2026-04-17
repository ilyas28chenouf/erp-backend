import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { FinanceCategoryType } from '../../domain/enums/finance-category-type.enum';

export class QueryFinanceCategoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: FinanceCategoryType, enumName: 'FinanceCategoryType' })
  @IsOptional()
  @IsEnum(FinanceCategoryType)
  type?: FinanceCategoryType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  isActive?: boolean;
}
