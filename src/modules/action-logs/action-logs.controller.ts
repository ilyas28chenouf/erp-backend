import { Controller, Get, Param, Patch, Query, UseGuards, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/presentation/guards/roles.guard';
import { ActionLogsService } from './action-logs.service';
import { MarkManyActionLogsSyncedDto } from './dto/mark-many-action-logs-synced.dto';
import { QueryActionLogsDto } from './dto/query-action-logs.dto';

@ApiTags('Action Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('action-logs')
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Get()
  @ApiOperation({ summary: 'List persistent backend action logs' })
  @ApiResponse({ status: 200, description: 'Action logs returned.' })
  findAll(@Query() query: QueryActionLogsDto) {
    return this.actionLogsService.findLogs(query);
  }

  @Get('sync/pending')
  @ApiOperation({ summary: 'List action logs pending synchronization' })
  @ApiResponse({ status: 200, description: 'Pending sync logs returned.' })
  findPendingSyncLogs() {
    return this.actionLogsService.findPendingSyncLogs();
  }

  @Patch('sync/mark-many-synced')
  @ApiOperation({ summary: 'Mark many action logs as synced' })
  @ApiResponse({ status: 200, description: 'Action logs marked as synced.' })
  markManyAsSynced(@Body() dto: MarkManyActionLogsSyncedDto) {
    return this.actionLogsService.markManyAsSynced(dto.ids);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get action log by id' })
  @ApiResponse({ status: 200, description: 'Action log returned.' })
  findOne(@Param('id') id: string) {
    return this.actionLogsService.findOne(id);
  }

  @Patch(':id/synced')
  @ApiOperation({ summary: 'Mark action log as synced' })
  @ApiResponse({ status: 200, description: 'Action log marked as synced.' })
  markAsSynced(@Param('id') id: string) {
    return this.actionLogsService.markAsSynced(id);
  }
}
