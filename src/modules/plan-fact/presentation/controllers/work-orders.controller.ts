import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateWorkOrderDto } from '../../application/dto/create-work-order.dto';
import { QueryWorkOrdersDto } from '../../application/dto/query-work-orders.dto';
import { UpdateWorkOrderDto } from '../../application/dto/update-work-order.dto';
import { PlanFactService } from '../../application/services/plan-fact.service';

@ApiTags('Work Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plan-fact/work-orders')
export class WorkOrdersController {
  constructor(private readonly planFactService: PlanFactService) {}

  @Post()
  @ApiOperation({ summary: 'Create work order' })
  @ApiResponse({ status: 201, description: 'Work order created.' })
  create(@Body() dto: CreateWorkOrderDto) {
    return this.planFactService.createWorkOrder(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List work orders' })
  @ApiResponse({ status: 200, description: 'Work orders returned.' })
  findAll(@Query() query: QueryWorkOrdersDto) {
    return this.planFactService.findWorkOrders(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order by id' })
  @ApiResponse({ status: 200, description: 'Work order returned.' })
  findOne(@Param('id') id: string) {
    return this.planFactService.findWorkOrder(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work order' })
  @ApiResponse({ status: 200, description: 'Work order updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.planFactService.updateWorkOrder(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work order' })
  @ApiResponse({ status: 200, description: 'Work order deleted.' })
  remove(@Param('id') id: string) {
    return this.planFactService.removeWorkOrder(id);
  }
}
