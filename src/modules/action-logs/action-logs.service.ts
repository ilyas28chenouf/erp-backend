import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionLogActionType } from './domain/enums/action-log-action-type.enum';
import { ActionLogSource } from './domain/enums/action-log-source.enum';
import { ActionLogSyncStatus } from './domain/enums/action-log-sync-status.enum';
import { CreateActionLogDto } from './dto/create-action-log.dto';
import { QueryActionLogsDto } from './dto/query-action-logs.dto';
import { ActionLogOrmEntity } from './infrastructure/persistence/action-log.orm-entity';
import { ActionLogsRequestContextService } from './action-logs-request-context.service';

type LogPayload = Omit<
  CreateActionLogDto,
  'actionDate' | 'beforeData' | 'afterData' | 'metadata'
> & {
  actionDate?: Date | string;
  beforeData?: unknown;
  afterData?: unknown;
  metadata?: unknown;
};

type ShortcutLogPayload = {
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  description?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
  metadata?: Record<string, unknown> | null;
  actorUserId?: string | null;
  source?: ActionLogSource;
};

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'accessToken',
  'refreshToken',
  'token',
  'secret',
]);

@Injectable()
export class ActionLogsService {
  constructor(
    @InjectRepository(ActionLogOrmEntity)
    private readonly actionLogsRepository: Repository<ActionLogOrmEntity>,
    private readonly requestContext: ActionLogsRequestContextService,
  ) {}

  createLog(payload: LogPayload) {
    const context = this.requestContext.getContext();
    const entity = this.actionLogsRepository.create({
      ...payload,
      actionDate: payload.actionDate ? new Date(payload.actionDate) : new Date(),
      actorUserId: payload.actorUserId ?? context?.actorUserId ?? null,
      beforeData: this.sanitize(payload.beforeData),
      afterData: this.sanitize(payload.afterData),
      metadata: this.sanitize(payload.metadata),
      ipAddress: payload.ipAddress ?? context?.ipAddress ?? null,
      userAgent: payload.userAgent ?? context?.userAgent ?? null,
      source: payload.source ?? ActionLogSource.ERP_BACKEND,
      syncStatus: payload.syncStatus ?? ActionLogSyncStatus.PENDING,
    });

    return this.actionLogsRepository.save(entity);
  }

  async safeLog(payload: LogPayload) {
    try {
      return await this.createLog(payload);
    } catch (error) {
      console.error('Action log write failed.', error);
      return null;
    }
  }

  logCreate(payload: ShortcutLogPayload) {
    return this.safeLog({
      ...payload,
      actionType: ActionLogActionType.CREATE,
      beforeData: null,
    });
  }

  logUpdate(payload: ShortcutLogPayload) {
    return this.safeLog({
      ...payload,
      actionType: ActionLogActionType.UPDATE,
    });
  }

  logDelete(payload: ShortcutLogPayload) {
    return this.safeLog({
      ...payload,
      actionType: ActionLogActionType.DELETE,
      afterData: null,
    });
  }

  logFileUpload(payload: ShortcutLogPayload) {
    return this.safeLog({
      ...payload,
      actionType: ActionLogActionType.UPLOAD_FILE,
    });
  }

  logExport(payload: ShortcutLogPayload) {
    return this.safeLog({
      ...payload,
      actionType: ActionLogActionType.EXPORT,
    });
  }

  logSystemAction(
    actionType: ActionLogActionType,
    payload: Omit<ShortcutLogPayload, 'source'> & { source?: ActionLogSource },
  ) {
    return this.safeLog({
      ...payload,
      actionType,
      source: payload.source ?? ActionLogSource.SYSTEM,
    });
  }

  async findLogs(query: QueryActionLogsDto) {
    const limit = Math.min(query.limit ?? 100, 500);
    const offset = query.offset ?? 0;
    const qb = this.actionLogsRepository
      .createQueryBuilder('actionLog')
      .leftJoinAndSelect('actionLog.actorUser', 'actorUser')
      .orderBy('actionLog.actionDate', 'DESC')
      .take(limit)
      .skip(offset);

    if (query.dateFrom) {
      qb.andWhere('actionLog.actionDate >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }
    if (query.dateTo) {
      qb.andWhere('actionLog.actionDate <= :dateTo', {
        dateTo: query.dateTo,
      });
    }
    if (query.actorUserId) {
      qb.andWhere('actionLog.actorUserId = :actorUserId', {
        actorUserId: query.actorUserId,
      });
    }
    if (query.actionType) {
      qb.andWhere('actionLog.actionType = :actionType', {
        actionType: query.actionType,
      });
    }
    if (query.entityType) {
      qb.andWhere('actionLog.entityType = :entityType', {
        entityType: query.entityType,
      });
    }
    if (query.entityId) {
      qb.andWhere('actionLog.entityId = :entityId', {
        entityId: query.entityId,
      });
    }
    if (query.source) {
      qb.andWhere('actionLog.source = :source', { source: query.source });
    }
    if (query.syncStatus) {
      qb.andWhere('actionLog.syncStatus = :syncStatus', {
        syncStatus: query.syncStatus,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const entity = await this.actionLogsRepository.findOne({
      where: { id },
      relations: { actorUser: true },
    });

    if (!entity) {
      throw new NotFoundException(`Action log with id "${id}" was not found.`);
    }

    return entity;
  }

  async markAsSynced(id: string) {
    const entity = await this.findOne(id);
    entity.syncStatus = ActionLogSyncStatus.SYNCED;
    entity.syncedAt = new Date();

    return this.actionLogsRepository.save(entity);
  }

  async markManyAsSynced(ids: string[]) {
    const syncedAt = new Date();
    await this.actionLogsRepository
      .createQueryBuilder()
      .update(ActionLogOrmEntity)
      .set({
        syncStatus: ActionLogSyncStatus.SYNCED,
        syncedAt,
      })
      .whereInIds(ids)
      .execute();

    return this.actionLogsRepository.findByIds(ids);
  }

  findPendingSyncLogs() {
    return this.findLogs({
      syncStatus: ActionLogSyncStatus.PENDING,
      limit: 500,
      offset: 0,
    });
  }

  private sanitize(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    return this.sanitizeValue(value) as Record<string, unknown>;
  }

  private sanitizeValue(value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeValue(item));
    }

    if (typeof value === 'object' && value !== null) {
      const result: Record<string, unknown> = {};

      for (const [key, nestedValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (SENSITIVE_KEYS.has(key)) {
          continue;
        }

        result[key] = this.sanitizeValue(nestedValue);
      }

      return result;
    }

    return value;
  }
}
