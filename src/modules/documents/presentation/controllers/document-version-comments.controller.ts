import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentVersionCommentDto } from '../../application/dto/create-document-version-comment.dto';
import { QueryDocumentVersionCommentsDto } from '../../application/dto/query-document-version-comments.dto';
import { UpdateDocumentVersionCommentDto } from '../../application/dto/update-document-version-comment.dto';
import { DocumentsService } from '../../application/services/documents.service';

@ApiTags('Document Version Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents/version-comments')
export class DocumentVersionCommentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create document version comment' })
  @ApiResponse({ status: 201, description: 'Document version comment created.' })
  create(
    @Body() dto: CreateDocumentVersionCommentDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.documentsService.createDocumentVersionComment(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List document version comments' })
  @ApiResponse({ status: 200, description: 'Document version comments returned.' })
  findAll(@Query() query: QueryDocumentVersionCommentsDto) {
    return this.documentsService.findDocumentVersionComments(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document version comment by id' })
  @ApiResponse({ status: 200, description: 'Document version comment returned.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findDocumentVersionComment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document version comment content' })
  @ApiResponse({ status: 200, description: 'Document version comment updated.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentVersionCommentDto,
  ) {
    return this.documentsService.updateDocumentVersionComment(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document version comment' })
  @ApiResponse({ status: 200, description: 'Document version comment deleted.' })
  remove(@Param('id') id: string) {
    return this.documentsService.removeDocumentVersionComment(id);
  }
}
