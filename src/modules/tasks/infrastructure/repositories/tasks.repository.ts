import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryTasksDto } from '../../application/dto/query-tasks.dto';
import { TasksRepositoryInterface } from '../../domain/interfaces/tasks.repository.interface';
import { TaskOrmEntity } from '../persistence/task.orm-entity';

@Injectable()
export class TasksRepository implements TasksRepositoryInterface {
  constructor(
    @InjectRepository(TaskOrmEntity)
    private readonly tasksRepository: Repository<TaskOrmEntity>,
  ) {}

  create(entity: Partial<TaskOrmEntity>) {
    return this.tasksRepository.save(this.tasksRepository.create(entity));
  }

  findAll(filters?: QueryTasksDto) {
    return this.tasksRepository.find({
      where: {
        projectId: filters?.projectId,
        assigneeUserId: filters?.assigneeUserId,
        status: filters?.status,
        priority: filters?.priority,
      },
      relations: { project: true, assigneeUser: true, createdByUser: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOneById(id: string) {
    return this.tasksRepository.findOne({
      where: { id },
      relations: { project: true, assigneeUser: true, createdByUser: true },
    });
  }

  async update(id: string, payload: Partial<TaskOrmEntity>) {
    const existing = await this.findOneById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.tasksRepository.save(existing);
  }

  async remove(id: string) {
    await this.tasksRepository.delete(id);
  }
}
