import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentVersionDto } from '../../application/dto/create-document-version.dto';
import { QueryDocumentVersionsDto } from '../../application/dto/query-document-versions.dto';
import { UpdateDocumentVersionDto } from '../../application/dto/update-document-version.dto';
import { DocumentsService } from '../../application/services/documents.service';

@ApiTags('Document Versions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents/versions')
export class DocumentVersionsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document version' })
  @ApiResponse({ status: 201, description: 'Document version created.' })
  create(@Body() dto: CreateDocumentVersionDto) {
    return this.documentsService.createDocumentVersion(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List document versions' })
  @ApiResponse({ status: 200, description: 'Document versions returned.' })
  findAll(@Query() query: QueryDocumentVersionsDto) {
    return this.documentsService.findDocumentVersions(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document version by id' })
  @ApiResponse({ status: 200, description: 'Document version returned.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findDocumentVersion(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document version' })
  @ApiResponse({ status: 200, description: 'Document version updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentVersionDto) {
    return this.documentsService.updateDocumentVersion(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document version' })
  @ApiResponse({ status: 200, description: 'Document version deleted.' })
  remove(@Param('id') id: string) {
    return this.documentsService.removeDocumentVersion(id);
  }
}
