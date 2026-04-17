import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentFolderDto } from '../../application/dto/create-document-folder.dto';
import { QueryDocumentFoldersDto } from '../../application/dto/query-document-folders.dto';
import { UpdateDocumentFolderDto } from '../../application/dto/update-document-folder.dto';
import { DocumentsService } from '../../application/services/documents.service';

@ApiTags('Document Folders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents/folders')
export class DocumentFoldersController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document folder' })
  @ApiResponse({ status: 201, description: 'Document folder created.' })
  create(@Body() dto: CreateDocumentFolderDto) {
    return this.documentsService.createDocumentFolder(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List document folders' })
  @ApiResponse({ status: 200, description: 'Document folders returned.' })
  findAll(@Query() query: QueryDocumentFoldersDto) {
    return this.documentsService.findDocumentFolders(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document folder by id' })
  @ApiResponse({ status: 200, description: 'Document folder returned.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findDocumentFolder(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document folder' })
  @ApiResponse({ status: 200, description: 'Document folder updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentFolderDto) {
    return this.documentsService.updateDocumentFolder(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document folder' })
  @ApiResponse({ status: 200, description: 'Document folder deleted.' })
  remove(@Param('id') id: string) {
    return this.documentsService.removeDocumentFolder(id);
  }
}
