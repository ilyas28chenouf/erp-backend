import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreatePlanFactEntryDto } from '../../application/dto/create-plan-fact-entry.dto';
import { QueryPlanFactEntriesDto } from '../../application/dto/query-plan-fact-entries.dto';
import { UpdatePlanFactEntryDto } from '../../application/dto/update-plan-fact-entry.dto';
import { PlanFactService } from '../../application/services/plan-fact.service';

@ApiTags('Plan Fact Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plan-fact/entries')
export class PlanFactEntriesController {
  constructor(private readonly planFactService: PlanFactService) {}

  @Post()
  @ApiOperation({ summary: 'Create plan/fact entry' })
  @ApiResponse({ status: 201, description: 'Plan/fact entry created.' })
  create(@Body() dto: CreatePlanFactEntryDto) {
    return this.planFactService.createPlanFactEntry(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List plan/fact entries' })
  @ApiResponse({ status: 200, description: 'Plan/fact entries returned.' })
  findAll(@Query() query: QueryPlanFactEntriesDto) {
    return this.planFactService.findPlanFactEntries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan/fact entry by id' })
  @ApiResponse({ status: 200, description: 'Plan/fact entry returned.' })
  findOne(@Param('id') id: string) {
    return this.planFactService.findPlanFactEntry(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update plan/fact entry' })
  @ApiResponse({ status: 200, description: 'Plan/fact entry updated.' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanFactEntryDto) {
    return this.planFactService.updatePlanFactEntry(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete plan/fact entry' })
  @ApiResponse({ status: 200, description: 'Plan/fact entry deleted.' })
  remove(@Param('id') id: string) {
    return this.planFactService.removePlanFactEntry(id);
  }
}
