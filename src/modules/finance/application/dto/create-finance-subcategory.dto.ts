import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FinanceCategoryType } from '../../domain/enums/finance-category-type.enum';

export class CreateFinanceSubcategoryDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'Макарова 60' })
  @IsString()
  name: string;

  @ApiProperty({ enum: FinanceCategoryType, enumName: 'FinanceCategoryType', example: FinanceCategoryType.EXPENSE })
  @IsEnum(FinanceCategoryType)
  type: FinanceCategoryType;

  @ApiProperty({ required: false, default: true, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
