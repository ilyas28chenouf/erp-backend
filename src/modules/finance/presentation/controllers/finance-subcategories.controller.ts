import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateFinanceSubcategoryDto } from '../../application/dto/create-finance-subcategory.dto';
import { QueryFinanceSubcategoriesDto } from '../../application/dto/query-finance-subcategories.dto';
import { UpdateFinanceSubcategoryDto } from '../../application/dto/update-finance-subcategory.dto';
import { FinanceService } from '../../application/services/finance.service';

@ApiTags('Finance Subcategories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance/subcategories')
export class FinanceSubcategoriesController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create finance subcategory' })
  @ApiResponse({ status: 201, description: 'Finance subcategory created.' })
  create(@Body() dto: CreateFinanceSubcategoryDto) {
    return this.financeService.createFinanceSubcategory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List finance subcategories' })
  @ApiResponse({ status: 200, description: 'Finance subcategories returned.' })
  findAll(@Query() query: QueryFinanceSubcategoriesDto) {
    return this.financeService.findFinanceSubcategories(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get finance subcategory by id' })
  @ApiResponse({ status: 200, description: 'Finance subcategory returned.' })
  findOne(@Param('id') id: string) {
    return this.financeService.findFinanceSubcategory(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update finance subcategory' })
  @ApiResponse({ status: 200, description: 'Finance subcategory updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateFinanceSubcategoryDto) {
    return this.financeService.updateFinanceSubcategory(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete finance subcategory' })
  @ApiResponse({ status: 200, description: 'Finance subcategory deleted.' })
  remove(@Param('id') id: string) {
    return this.financeService.removeFinanceSubcategory(id);
  }
}
