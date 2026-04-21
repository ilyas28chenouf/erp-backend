import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateFinanceCategoryDto {
  @ApiProperty({ example: 'Аренда' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: true, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
