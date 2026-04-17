import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentDto } from '../../application/dto/create-document.dto';
import { QueryDocumentsDto } from '../../application/dto/query-documents.dto';
import { UpdateDocumentDto } from '../../application/dto/update-document.dto';
import { DocumentsService } from '../../application/services/documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document' })
  @ApiResponse({ status: 201, description: 'Document created.' })
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.createDocument(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List documents' })
  @ApiResponse({ status: 200, description: 'Documents returned.' })
  findAll(@Query() query: QueryDocumentsDto) {
    return this.documentsService.findDocuments(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({ status: 200, description: 'Document returned.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findDocument(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document' })
  @ApiResponse({ status: 200, description: 'Document updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.updateDocument(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 200, description: 'Document deleted.' })
  remove(@Param('id') id: string) {
    return this.documentsService.removeDocument(id);
  }
}
