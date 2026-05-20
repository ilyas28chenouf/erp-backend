import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/presentation/guards/roles.guard';
import { SyncResultDto } from './dto/sync-result.dto';
import { SyncService } from './sync.service';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get preprod sync status' })
  @ApiResponse({ status: 200, description: 'Sync status returned.' })
  getStatus() {
    return this.syncService.getStatus();
  }

  @Post('pull-from-prod')
  @ApiOperation({ summary: 'Pull pending action logs from prod and apply locally' })
  @ApiResponse({
    status: 201,
    description: 'Pull sync completed.',
    type: SyncResultDto,
  })
  pullFromProd() {
    return this.syncService.pullFromProd();
  }
}
