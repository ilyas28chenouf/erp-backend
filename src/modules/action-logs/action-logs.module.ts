import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLogsContextMiddleware } from './action-logs-context.middleware';
import { ActionLogsController } from './action-logs.controller';
import { ActionLogsRequestContextService } from './action-logs-request-context.service';
import { ActionLogsService } from './action-logs.service';
import { ActionLogOrmEntity } from './infrastructure/persistence/action-log.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionLogOrmEntity])],
  controllers: [ActionLogsController],
  providers: [ActionLogsService, ActionLogsRequestContextService],
  exports: [ActionLogsService, ActionLogsRequestContextService, TypeOrmModule],
})
export class ActionLogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActionLogsContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
