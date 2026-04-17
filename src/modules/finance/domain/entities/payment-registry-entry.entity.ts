import { PaymentRegistryEntryType } from '../enums/payment-registry-entry-type.enum';

export class PaymentRegistryEntry {
  id: string;
  type: PaymentRegistryEntryType;
  projectId?: string | null;
  counterpartyId?: string | null;
  amount: string;
  operationDate: Date;
  categoryId: string;
  comment?: string | null;
  createdByUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
