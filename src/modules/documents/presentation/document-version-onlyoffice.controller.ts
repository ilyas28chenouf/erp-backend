import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { DocumentsService } from '../application/services/documents.service';

@ApiTags('Document Versions ONLYOFFICE')
@Controller('documents/versions')
export class DocumentVersionOnlyOfficeController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id/file-onlyoffice')
  @ApiOperation({ summary: 'Download document version file for ONLYOFFICE' })
  @ApiResponse({ status: 200, description: 'Document version file returned.' })
  async getFileForOnlyOffice(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { documentVersion, file } =
      await this.documentsService.getDocumentVersionFile(id);

    res.setHeader('Content-Type', documentVersion.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(documentVersion.fileName)}"`,
    );

    return file;
  }
}