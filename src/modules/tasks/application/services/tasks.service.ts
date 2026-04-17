import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TASKS_REPOSITORY } from '../../domain/interfaces/tasks.repository.interface';
import type { TasksRepositoryInterface } from '../../domain/interfaces/tasks.repository.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { QueryTasksDto } from '../dto/query-tasks.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskPriority } from '../../domain/enums/task-priority.enum';
import { TaskStatus } from '../../domain/enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY)
    private readonly tasksRepository: TasksRepositoryInterface,
  ) {}

  create(dto: CreateTaskDto) {
    return this.tasksRepository.create({
      ...dto,
      dueDate: dto.dueDate ? dto.dueDate.toISOString().slice(0, 10) : null,
      status: dto.status ?? TaskStatus.TODO,
      priority: dto.priority ?? TaskPriority.MEDIUM,
    });
  }

  findAll(query: QueryTasksDto) {
    return this.tasksRepository.findAll(query as Record<string, unknown>);
  }

  async findOne(id: string) {
    const entity = await this.tasksRepository.findOneById(id);
    if (!entity) throw new NotFoundException(`Task with id "${id}" was not found.`);
    return entity;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const updated = await this.tasksRepository.update(id, {
      ...dto,
      dueDate: dto.dueDate ? dto.dueDate.toISOString().slice(0, 10) : dto.dueDate === null ? null : undefined,
    });
    if (!updated) throw new NotFoundException(`Task with id "${id}" was not found.`);
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.tasksRepository.remove(id);
  }
}
