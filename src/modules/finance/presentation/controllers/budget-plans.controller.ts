import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateBudgetPlanDto } from '../../application/dto/create-budget-plan.dto';
import { QueryBudgetPlansDto } from '../../application/dto/query-budget-plans.dto';
import { UpdateBudgetPlanDto } from '../../application/dto/update-budget-plan.dto';
import { FinanceService } from '../../application/services/finance.service';

@ApiTags('Budget Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance/budget-plans')
export class BudgetPlansController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create budget plan' })
  @ApiResponse({ status: 201, description: 'Budget plan created.' })
  create(@Body() dto: CreateBudgetPlanDto) {
    return this.financeService.createBudgetPlan(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List budget plans' })
  @ApiResponse({ status: 200, description: 'Budget plans returned.' })
  findAll(@Query() query: QueryBudgetPlansDto) {
    return this.financeService.findBudgetPlans(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget plan by id' })
  @ApiResponse({ status: 200, description: 'Budget plan returned.' })
  findOne(@Param('id') id: string) {
    return this.financeService.findBudgetPlan(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update budget plan' })
  @ApiResponse({ status: 200, description: 'Budget plan updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateBudgetPlanDto) {
    return this.financeService.updateBudgetPlan(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete budget plan' })
  @ApiResponse({ status: 200, description: 'Budget plan deleted.' })
  remove(@Param('id') id: string) {
    return this.financeService.removeBudgetPlan(id);
  }
}
