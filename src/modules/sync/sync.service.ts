import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionLogActionType } from '../action-logs/domain/enums/action-log-action-type.enum';
import { ActionLogSource } from '../action-logs/domain/enums/action-log-source.enum';
import { ActionLogsService } from '../action-logs/action-logs.service';
import { SyncResultDto } from './dto/sync-result.dto';
import { ProdApiService } from './prod-api.service';
import { SyncHandlersService } from './sync-handlers.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prodApiService: ProdApiService,
    private readonly syncHandlersService: SyncHandlersService,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  getStatus() {
    return {
      enabled: this.isEnabled(),
      prodApiBaseUrl: this.configService.get<string>('PROD_API_BASE_URL') ?? null,
    };
  }

  async pullFromProd(): Promise<SyncResultDto> {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Sync is disabled.');
    }

    const logs = await this.prodApiService.getPendingActionLogs();
    const sortedLogs = [...logs].sort(
      (left, right) =>
        new Date(left.actionDate).getTime() - new Date(right.actionDate).getTime(),
    );
    const result: SyncResultDto = {
      processed: 0,
      synced: 0,
      failed: 0,
      ignored: 0,
      errors: [],
    };

    for (const log of sortedLogs) {
      result.processed += 1;

      try {
        const applyResult = await this.syncHandlersService.apply(log);

        if (applyResult.status === 'synced') {
          await this.prodApiService.markActionLogSynced(log.id);
          result.synced += 1;
          continue;
        }

        if (applyResult.status === 'ignored') {
          result.ignored += 1;
          result.errors.push({
            actionLogId: log.id,
            entityType: log.entityType,
            actionType: log.actionType,
            message: applyResult.reason,
          });
          continue;
        }

        result.failed += 1;
        result.errors.push({
          actionLogId: log.id,
          entityType: log.entityType,
          actionType: log.actionType,
          message: applyResult.reason,
        });
      } catch (error) {
        result.failed += 1;
        result.errors.push({
          actionLogId: log.id,
          entityType: log.entityType,
          actionType: log.actionType,
          message: error instanceof Error ? error.message : 'Unknown sync error.',
        });
      }
    }

    await this.actionLogsService.logSystemAction(ActionLogActionType.SYNC_PULL, {
      entityType: 'SYNC',
      entityId: null,
      entityLabel: 'Pull from prod',
      description: 'Preprod pulled pending action logs from prod.',
      source: ActionLogSource.SYNC_SERVICE,
      metadata: { ...result },
    });

    return result;
  }

  private isEnabled() {
    return this.configService.get<string>('SYNC_ENABLED', 'false') === 'true';
  }
}
