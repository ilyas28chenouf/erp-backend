import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface ActionLogsRequestContext {
  actorUserId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class ActionLogsRequestContextService {
  private readonly storage = new AsyncLocalStorage<ActionLogsRequestContext>();

  run<T>(context: ActionLogsRequestContext, callback: () => T) {
    return this.storage.run(context, callback);
  }

  getContext() {
    return this.storage.getStore();
  }
}
