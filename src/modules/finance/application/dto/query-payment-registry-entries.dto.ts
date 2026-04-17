import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaymentRegistryEntryType } from '../../domain/enums/payment-registry-entry-type.enum';

export class QueryPaymentRegistryEntriesDto {
  @ApiPropertyOptional({ enum: PaymentRegistryEntryType, enumName: 'PaymentRegistryEntryType' })
  @IsOptional()
  @IsEnum(PaymentRegistryEntryType)
  type?: PaymentRegistryEntryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  counterpartyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
