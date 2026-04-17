import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateAuditLogDto } from '../../application/dto/create-audit-log.dto';
import { QueryAuditLogsDto } from '../../application/dto/query-audit-logs.dto';
import { UpdateAuditLogDto } from '../../application/dto/update-audit-log.dto';
import { AuditService } from '../../application/services/audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit/logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  @ApiOperation({ summary: 'Create audit log' })
  @ApiResponse({ status: 201, description: 'Audit log created.' })
  create(@Body() dto: CreateAuditLogDto) {
    return this.auditService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List audit logs' })
  @ApiResponse({ status: 200, description: 'Audit logs returned.' })
  findAll(@Query() query: QueryAuditLogsDto) {
    return this.auditService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit log by id' })
  @ApiResponse({ status: 200, description: 'Audit log returned.' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update audit log' })
  @ApiResponse({ status: 200, description: 'Audit log updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateAuditLogDto) {
    return this.auditService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete audit log' })
  @ApiResponse({ status: 200, description: 'Audit log deleted.' })
  remove(@Param('id') id: string) {
    return this.auditService.remove(id);
  }
}
