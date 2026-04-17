import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentRegistryEntryType } from '../../domain/enums/payment-registry-entry-type.enum';

export class CreatePaymentRegistryEntryDto {
  @ApiProperty({ enum: PaymentRegistryEntryType, enumName: 'PaymentRegistryEntryType' })
  @IsEnum(PaymentRegistryEntryType)
  type: PaymentRegistryEntryType;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  counterpartyId?: string | null;

  @ApiProperty({ example: '150000.00' })
  @IsNumberString()
  amount: string;

  @ApiProperty({ type: String, format: 'date' })
  @Type(() => Date)
  @IsDate()
  operationDate: Date;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;
}
