import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TASKS_REPOSITORY } from './domain/interfaces/tasks.repository.interface';
import { TasksService } from './application/services/tasks.service';
import { TaskOrmEntity } from './infrastructure/persistence/task.orm-entity';
import { TasksRepository } from './infrastructure/repositories/tasks.repository';
import { TasksController } from './presentation/controllers/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskOrmEntity])],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    { provide: TASKS_REPOSITORY, useExisting: TasksRepository },
  ],
  exports: [TasksService, TypeOrmModule],
})
export class TasksModule {}
