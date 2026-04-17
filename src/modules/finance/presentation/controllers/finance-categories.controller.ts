import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateFinanceCategoryDto } from '../../application/dto/create-finance-category.dto';
import { QueryFinanceCategoriesDto } from '../../application/dto/query-finance-categories.dto';
import { UpdateFinanceCategoryDto } from '../../application/dto/update-finance-category.dto';
import { FinanceService } from '../../application/services/finance.service';

@ApiTags('Finance Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance/categories')
export class FinanceCategoriesController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create finance category' })
  @ApiResponse({ status: 201, description: 'Finance category created.' })
  create(@Body() dto: CreateFinanceCategoryDto) {
    return this.financeService.createFinanceCategory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List finance categories' })
  @ApiResponse({ status: 200, description: 'Finance categories returned.' })
  findAll(@Query() query: QueryFinanceCategoriesDto) {
    return this.financeService.findFinanceCategories(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get finance category by id' })
  @ApiResponse({ status: 200, description: 'Finance category returned.' })
  findOne(@Param('id') id: string) {
    return this.financeService.findFinanceCategory(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update finance category' })
  @ApiResponse({ status: 200, description: 'Finance category updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateFinanceCategoryDto) {
    return this.financeService.updateFinanceCategory(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete finance category' })
  @ApiResponse({ status: 200, description: 'Finance category deleted.' })
  remove(@Param('id') id: string) {
    return this.financeService.removeFinanceCategory(id);
  }
}
