import { PartialType } from '@nestjs/swagger';
import { CreatePaymentRegistryEntryDto } from './create-payment-registry-entry.dto';

export class UpdatePaymentRegistryEntryDto extends PartialType(
  CreatePaymentRegistryEntryDto,
) {}
