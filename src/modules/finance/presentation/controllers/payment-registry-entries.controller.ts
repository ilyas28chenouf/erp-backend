import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreatePaymentRegistryEntryDto } from '../../application/dto/create-payment-registry-entry.dto';
import { QueryPaymentRegistryEntriesDto } from '../../application/dto/query-payment-registry-entries.dto';
import { UpdatePaymentRegistryEntryDto } from '../../application/dto/update-payment-registry-entry.dto';
import { FinanceService } from '../../application/services/finance.service';

@ApiTags('Payment Registry Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance/payment-registry-entries')
export class PaymentRegistryEntriesController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create weekly payment registry entry' })
  @ApiResponse({ status: 201, description: 'Payment registry entry created.' })
  create(@Body() dto: CreatePaymentRegistryEntryDto) {
    return this.financeService.createPaymentRegistryEntry(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List weekly payment registry entries' })
  @ApiResponse({ status: 200, description: 'Payment registry entries returned.' })
  findAll(@Query() query: QueryPaymentRegistryEntriesDto) {
    return this.financeService.findPaymentRegistryEntries(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment registry entry by id' })
  @ApiResponse({ status: 200, description: 'Payment registry entry returned.' })
  findOne(@Param('id') id: string) {
    return this.financeService.findPaymentRegistryEntry(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment registry entry' })
  @ApiResponse({ status: 200, description: 'Payment registry entry updated.' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentRegistryEntryDto) {
    return this.financeService.updatePaymentRegistryEntry(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment registry entry' })
  @ApiResponse({ status: 200, description: 'Payment registry entry deleted.' })
  remove(@Param('id') id: string) {
    return this.financeService.removePaymentRegistryEntry(id);
  }
}
