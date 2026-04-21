import { PartialType } from '@nestjs/swagger';
import { CreateFinanceSubcategoryDto } from './create-finance-subcategory.dto';

export class UpdateFinanceSubcategoryDto extends PartialType(
  CreateFinanceSubcategoryDto,
) {}
