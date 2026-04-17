import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateProjectDto } from '../../application/dto/create-project.dto';
import { QueryProjectsDto } from '../../application/dto/query-projects.dto';
import { UpdateProjectDto } from '../../application/dto/update-project.dto';
import { ProjectsService } from '../../application/services/projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({ status: 201, description: 'Project successfully created.' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'List projects' })
  @ApiResponse({ status: 200, description: 'Projects returned.' })
  findAll(@Query() query: QueryProjectsDto) {
    return this.projectsService.findProjects(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Project returned.' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findProject(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by id' })
  @ApiResponse({ status: 200, description: 'Project updated.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by id' })
  @ApiResponse({ status: 200, description: 'Project deleted.' })
  remove(@Param('id') id: string) {
    return this.projectsService.removeProject(id);
  }
}
