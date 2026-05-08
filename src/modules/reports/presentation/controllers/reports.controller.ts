import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
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

  @Get('plan-fact/service-lines/:serviceLineId/excel')
  @ApiOperation({ summary: 'Export full monthly weekly plan/fact table to Excel' })
  @ApiParam({ name: 'serviceLineId', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Excel report file returned.' })
  async exportPlanFactServiceLineExcel(
    @Param('serviceLineId') serviceLineId: string,
    @Res() res: Response,
  ) {
    const exportFile = await this.reportsService.exportPlanFactServiceLineExcel(
      serviceLineId,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="plan-fact-${serviceLineId}.xlsx"`,
    );
    res.end(Buffer.from(exportFile.buffer));
  }
}
