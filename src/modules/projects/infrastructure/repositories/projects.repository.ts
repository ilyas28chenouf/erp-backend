import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { QueryProjectMembersDto } from '../../application/dto/query-project-members.dto';
import { QueryProjectsDto } from '../../application/dto/query-projects.dto';
import { ProjectsRepositoryInterface } from '../../domain/interfaces/projects.repository.interface';
import { ProjectMemberOrmEntity } from '../persistence/project-member.orm-entity';
import { ProjectOrmEntity } from '../persistence/project.orm-entity';

@Injectable()
export class ProjectsRepository implements ProjectsRepositoryInterface {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly projectsRepository: Repository<ProjectOrmEntity>,
    @InjectRepository(ProjectMemberOrmEntity)
    private readonly membersRepository: Repository<ProjectMemberOrmEntity>,
  ) {}

  async createProject(entity: Partial<ProjectOrmEntity>): Promise<ProjectOrmEntity> {
    return this.projectsRepository.save(this.projectsRepository.create(entity));
  }

  async findProjects(filters?: QueryProjectsDto): Promise<ProjectOrmEntity[]> {
    const where: FindOptionsWhere<ProjectOrmEntity> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.responsibleUserId) {
      where.responsibleUserId = filters.responsibleUserId;
    }

    if (filters?.clientName) {
      where.clientName = ILike(`%${filters.clientName}%`);
    }

    if (filters?.name) {
      where.name = ILike(`%${filters.name}%`);
    }

    return this.projectsRepository.find({
      where,
      relations: {
        responsibleUser: true,
        members: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findProjectById(id: string): Promise<ProjectOrmEntity | null> {
    return this.projectsRepository.findOne({
      where: { id },
      relations: {
        responsibleUser: true,
        members: true,
      },
    });
  }

  async updateProject(
    id: string,
    payload: Partial<ProjectOrmEntity>,
  ): Promise<ProjectOrmEntity | null> {
    const existing = await this.findProjectById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.projectsRepository.save(existing);
  }

  async removeProject(id: string): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async createProjectMember(
    entity: Partial<ProjectMemberOrmEntity>,
  ): Promise<ProjectMemberOrmEntity> {
    return this.membersRepository.save(this.membersRepository.create(entity));
  }

  findProjectMembers(
    filters?: QueryProjectMembersDto,
  ): Promise<ProjectMemberOrmEntity[]> {
    return this.membersRepository.find({
      where: {
        projectId: filters?.projectId,
        userId: filters?.userId,
      },
      relations: {
        project: true,
        user: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findProjectMemberById(id: string): Promise<ProjectMemberOrmEntity | null> {
    return this.membersRepository.findOne({
      where: { id },
      relations: {
        project: true,
        user: true,
      },
    });
  }

  async updateProjectMember(
    id: string,
    payload: Partial<ProjectMemberOrmEntity>,
  ): Promise<ProjectMemberOrmEntity | null> {
    const existing = await this.findProjectMemberById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.membersRepository.save(existing);
  }

  async removeProjectMember(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }
}
