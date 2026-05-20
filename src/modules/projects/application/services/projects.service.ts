import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActionLogsService } from '../../../action-logs/action-logs.service';
import {
  PROJECTS_REPOSITORY,
} from '../../domain/interfaces/projects.repository.interface';
import type { ProjectsRepositoryInterface } from '../../domain/interfaces/projects.repository.interface';
import { CreateProjectMemberDto } from '../dto/create-project-member.dto';
import { CreateProjectDto } from '../dto/create-project.dto';
import { QueryProjectMembersDto } from '../dto/query-project-members.dto';
import { QueryProjectsDto } from '../dto/query-projects.dto';
import { UpdateProjectMemberDto } from '../dto/update-project-member.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(PROJECTS_REPOSITORY)
    private readonly projectsRepository: ProjectsRepositoryInterface,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const created = await this.projectsRepository.createProject({
      ...createProjectDto,
      startDate: createProjectDto.startDate.toISOString().slice(0, 10),
      deadline: createProjectDto.deadline
        ? createProjectDto.deadline.toISOString().slice(0, 10)
        : null,
    });
    await this.actionLogsService.logCreate({
      entityType: 'PROJECT',
      entityId: created.id,
      entityLabel: created.name,
      description: 'Project created.',
      afterData: created,
    });

    return created;
  }

  findProjects(query: QueryProjectsDto) {
    return this.projectsRepository.findProjects(query as Record<string, unknown>);
  }

  async findProject(id: string) {
    const project = await this.projectsRepository.findProjectById(id);
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" was not found.`);
    }
    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    const existing = await this.findProject(id);
    const updated = await this.projectsRepository.updateProject(id, {
      ...updateProjectDto,
      startDate: updateProjectDto.startDate
        ? updateProjectDto.startDate.toISOString().slice(0, 10)
        : undefined,
      deadline: updateProjectDto.deadline
        ? updateProjectDto.deadline.toISOString().slice(0, 10)
        : updateProjectDto.deadline === null
          ? null
          : undefined,
    });
    if (!updated) {
      throw new NotFoundException(`Project with id "${id}" was not found.`);
    }
    await this.actionLogsService.logUpdate({
      entityType: 'PROJECT',
      entityId: updated.id,
      entityLabel: updated.name,
      description: 'Project updated.',
      beforeData: existing,
      afterData: updated,
    });
    return updated;
  }

  async removeProject(id: string) {
    const existing = await this.findProject(id);
    await this.projectsRepository.removeProject(id);
    await this.actionLogsService.logDelete({
      entityType: 'PROJECT',
      entityId: existing.id,
      entityLabel: existing.name,
      description: 'Project deleted.',
      beforeData: existing,
    });
  }

  createProjectMember(createProjectMemberDto: CreateProjectMemberDto) {
    return this.projectsRepository.createProjectMember(createProjectMemberDto);
  }

  findProjectMembers(query: QueryProjectMembersDto) {
    return this.projectsRepository.findProjectMembers(
      query as Record<string, unknown>,
    );
  }

  async findProjectMember(id: string) {
    const member = await this.projectsRepository.findProjectMemberById(id);
    if (!member) {
      throw new NotFoundException(
        `Project member with id "${id}" was not found.`,
      );
    }
    return member;
  }

  async updateProjectMember(
    id: string,
    updateProjectMemberDto: UpdateProjectMemberDto,
  ) {
    const updated = await this.projectsRepository.updateProjectMember(
      id,
      updateProjectMemberDto,
    );
    if (!updated) {
      throw new NotFoundException(
        `Project member with id "${id}" was not found.`,
      );
    }
    return updated;
  }

  async removeProjectMember(id: string) {
    await this.findProjectMember(id);
    await this.projectsRepository.removeProjectMember(id);
  }
}
