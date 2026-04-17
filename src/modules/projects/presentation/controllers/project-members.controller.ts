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
import { CreateProjectMemberDto } from '../../application/dto/create-project-member.dto';
import { QueryProjectMembersDto } from '../../application/dto/query-project-members.dto';
import { UpdateProjectMemberDto } from '../../application/dto/update-project-member.dto';
import { ProjectsService } from '../../application/services/projects.service';

@ApiTags('Project Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project member assignment' })
  @ApiResponse({ status: 201, description: 'Project member created.' })
  create(@Body() createProjectMemberDto: CreateProjectMemberDto) {
    return this.projectsService.createProjectMember(createProjectMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'List project members' })
  @ApiResponse({ status: 200, description: 'Project members returned.' })
  findAll(@Query() query: QueryProjectMembersDto) {
    return this.projectsService.findProjectMembers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project member by id' })
  @ApiResponse({ status: 200, description: 'Project member returned.' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findProjectMember(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project member' })
  @ApiResponse({ status: 200, description: 'Project member updated.' })
  update(
    @Param('id') id: string,
    @Body() updateProjectMemberDto: UpdateProjectMemberDto,
  ) {
    return this.projectsService.updateProjectMember(id, updateProjectMemberDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project member' })
  @ApiResponse({ status: 200, description: 'Project member deleted.' })
  remove(@Param('id') id: string) {
    return this.projectsService.removeProjectMember(id);
  }
}
