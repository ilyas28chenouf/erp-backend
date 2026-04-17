import { ProjectOrmEntity } from '../../infrastructure/persistence/project.orm-entity';
import { ProjectMemberOrmEntity } from '../../infrastructure/persistence/project-member.orm-entity';

export interface ProjectsRepositoryInterface {
  createProject(entity: Partial<ProjectOrmEntity>): Promise<ProjectOrmEntity>;
  findProjects(filters?: Record<string, unknown>): Promise<ProjectOrmEntity[]>;
  findProjectById(id: string): Promise<ProjectOrmEntity | null>;
  updateProject(
    id: string,
    payload: Partial<ProjectOrmEntity>,
  ): Promise<ProjectOrmEntity | null>;
  removeProject(id: string): Promise<void>;
  createProjectMember(
    entity: Partial<ProjectMemberOrmEntity>,
  ): Promise<ProjectMemberOrmEntity>;
  findProjectMembers(
    filters?: Record<string, unknown>,
  ): Promise<ProjectMemberOrmEntity[]>;
  findProjectMemberById(id: string): Promise<ProjectMemberOrmEntity | null>;
  updateProjectMember(
    id: string,
    payload: Partial<ProjectMemberOrmEntity>,
  ): Promise<ProjectMemberOrmEntity | null>;
  removeProjectMember(id: string): Promise<void>;
}

export const PROJECTS_REPOSITORY = Symbol('PROJECTS_REPOSITORY');
