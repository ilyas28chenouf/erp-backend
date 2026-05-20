import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { ActionLogsRequestContextService } from './action-logs-request-context.service';

@Injectable()
export class ActionLogsContextMiddleware implements NestMiddleware {
  constructor(
    private readonly requestContext: ActionLogsRequestContextService,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    this.requestContext.run(
      {
        actorUserId: this.extractActorUserId(req),
        ipAddress: this.extractIpAddress(req),
        userAgent: req.headers['user-agent'] ?? null,
      },
      next,
    );
  }

  private extractActorUserId(req: Request) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return null;
    }

    try {
      const [, payload] = header.split(' ')[1].split('.');
      const decoded = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
      ) as { sub?: string };

      return decoded.sub ?? null;
    } catch {
      return null;
    }
  }

  private extractIpAddress(req: Request) {
    const forwardedFor = req.headers['x-forwarded-for'];

    if (Array.isArray(forwardedFor)) {
      return forwardedFor[0] ?? req.ip ?? null;
    }

    return forwardedFor?.split(',')[0]?.trim() ?? req.ip ?? null;
  }
}
