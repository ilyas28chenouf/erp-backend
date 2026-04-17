import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { ReportsService } from '../../application/services/reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get ERP overview report' })
  @ApiResponse({ status: 200, description: 'Overview report returned.' })
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('project-workload')
  @ApiOperation({ summary: 'Get project workload report' })
  @ApiResponse({ status: 200, description: 'Project workload report returned.' })
  getProjectWorkload() {
    return this.reportsService.getProjectWorkload();
  }
}
