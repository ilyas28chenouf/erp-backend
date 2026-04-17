import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateCounterpartyDto } from '../../application/dto/create-counterparty.dto';
import { QueryCounterpartiesDto } from '../../application/dto/query-counterparties.dto';
import { UpdateCounterpartyDto } from '../../application/dto/update-counterparty.dto';
import { FinanceService } from '../../application/services/finance.service';

@ApiTags('Counterparties')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance/counterparties')
export class CounterpartiesController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create counterparty' })
  @ApiResponse({ status: 201, description: 'Counterparty created.' })
  create(@Body() dto: CreateCounterpartyDto) {
    return this.financeService.createCounterparty(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List counterparties' })
  @ApiResponse({ status: 200, description: 'Counterparties returned.' })
  findAll(@Query() query: QueryCounterpartiesDto) {
    return this.financeService.findCounterparties(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get counterparty by id' })
  @ApiResponse({ status: 200, description: 'Counterparty returned.' })
  findOne(@Param('id') id: string) {
    return this.financeService.findCounterparty(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update counterparty' })
  @ApiResponse({ status: 200, description: 'Counterparty updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateCounterpartyDto) {
    return this.financeService.updateCounterparty(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete counterparty' })
  @ApiResponse({ status: 200, description: 'Counterparty deleted.' })
  remove(@Param('id') id: string) {
    return this.financeService.removeCounterparty(id);
  }
}
