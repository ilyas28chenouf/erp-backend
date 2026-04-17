import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateServiceLineDto } from '../../application/dto/create-service-line.dto';
import { QueryServiceLinesDto } from '../../application/dto/query-service-lines.dto';
import { UpdateServiceLineDto } from '../../application/dto/update-service-line.dto';
import { PlanFactService } from '../../application/services/plan-fact.service';

@ApiTags('Service Lines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plan-fact/service-lines')
export class ServiceLinesController {
  constructor(private readonly planFactService: PlanFactService) {}

  @Post()
  @ApiOperation({ summary: 'Create service line' })
  @ApiResponse({ status: 201, description: 'Service line created.' })
  create(@Body() dto: CreateServiceLineDto) {
    return this.planFactService.createServiceLine(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List service lines' })
  @ApiResponse({ status: 200, description: 'Service lines returned.' })
  findAll(@Query() query: QueryServiceLinesDto) {
    return this.planFactService.findServiceLines(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service line by id' })
  @ApiResponse({ status: 200, description: 'Service line returned.' })
  findOne(@Param('id') id: string) {
    return this.planFactService.findServiceLine(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service line' })
  @ApiResponse({ status: 200, description: 'Service line updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceLineDto) {
    return this.planFactService.updateServiceLine(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service line' })
  @ApiResponse({ status: 200, description: 'Service line deleted.' })
  remove(@Param('id') id: string) {
    return this.planFactService.removeServiceLine(id);
  }
}
