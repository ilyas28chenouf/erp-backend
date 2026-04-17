import { AuditAction } from '../enums/audit-action.enum';

export class AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorUserId?: string | null;
  payload?: Record<string, unknown> | null;
  createdAt: Date;
}
