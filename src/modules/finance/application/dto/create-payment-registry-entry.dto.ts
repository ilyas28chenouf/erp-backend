import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreatePaymentRegistryEntryDto {
  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  counterpartyId?: string | null;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  subcategoryId: string;

  @ApiProperty({ example: '349000.00' })
  @IsNumberString()
  planAmount: string;

  @ApiProperty({ example: '349000.00' })
  @IsNumberString()
  factAmount: string;

  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(3000)
  year: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 'с 26.01.2026 по 01.02.2026' })
  @IsString()
  weekLabel: string;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsString()
  comment?: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;
}
