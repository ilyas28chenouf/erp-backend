import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PROJECTS_REPOSITORY,
} from './domain/interfaces/projects.repository.interface';
import { ProjectsService } from './application/services/projects.service';
import { ProjectMemberOrmEntity } from './infrastructure/persistence/project-member.orm-entity';
import { ProjectOrmEntity } from './infrastructure/persistence/project.orm-entity';
import { ProjectsRepository } from './infrastructure/repositories/projects.repository';
import { ProjectMembersController } from './presentation/controllers/project-members.controller';
import { ProjectsController } from './presentation/controllers/projects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOrmEntity, ProjectMemberOrmEntity])],
  controllers: [ProjectsController, ProjectMembersController],
  providers: [
    ProjectsService,
    ProjectsRepository,
    {
      provide: PROJECTS_REPOSITORY,
      useExisting: ProjectsRepository,
    },
  ],
  exports: [ProjectsService, TypeOrmModule],
})
export class ProjectsModule {}
