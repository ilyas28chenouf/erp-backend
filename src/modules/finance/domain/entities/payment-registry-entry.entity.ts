export class PaymentRegistryEntry {
  id: string;
  projectId?: string | null;
  counterpartyId?: string | null;
  subcategoryId: string;
  planAmount: string;
  factAmount: string;
  year: number;
  month: number;
  weekLabel: string;
  comment?: string | null;
  createdByUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
