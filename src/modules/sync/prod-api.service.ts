import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ActionLogOrmEntity } from '../action-logs/infrastructure/persistence/action-log.orm-entity';

@Injectable()
export class ProdApiService {
  constructor(private readonly configService: ConfigService) {}

  async getPendingActionLogs() {
    return this.request<ActionLogOrmEntity[]>('/action-logs/sync/pending');
  }

  async markActionLogSynced(id: string) {
    return this.request<ActionLogOrmEntity>(`/action-logs/${id}/synced`, {
      method: 'PATCH',
    });
  }

  async markManySynced(ids: string[]) {
    return this.request<ActionLogOrmEntity[]>('/action-logs/sync/mark-many-synced', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = this.configService.get<string>('PROD_API_BASE_URL');
    const token = this.configService.get<string>('PROD_SYNC_TOKEN');

    if (!baseUrl) {
      throw new ServiceUnavailableException('PROD_API_BASE_URL is not configured.');
    }

    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Prod API request failed with status ${response.status}.`,
      );
    }

    return (await response.json()) as T;
  }
}
