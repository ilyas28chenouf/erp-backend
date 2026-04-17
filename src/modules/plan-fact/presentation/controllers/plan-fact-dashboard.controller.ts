import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { QueryDashboardSummaryDto } from '../../application/dto/query-dashboard-summary.dto';
import { PlanFactService } from '../../application/services/plan-fact.service';

@ApiTags('Plan Fact Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plan-fact')
export class PlanFactDashboardController {
  constructor(private readonly planFactService: PlanFactService) {}

  @Get('dashboard-summary')
  @ApiOperation({ summary: 'Get dashboard summary for plan/fact structure' })
  @ApiResponse({ status: 200, description: 'Dashboard summary returned.' })
  getDashboardSummary(@Query() query: QueryDashboardSummaryDto) {
    return this.planFactService.getDashboardSummary(query);
  }
}
