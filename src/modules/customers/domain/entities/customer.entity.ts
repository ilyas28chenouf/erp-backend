export class Customer {
  id: string;
  name: string;
  contractNumber?: string | null;
  status?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
