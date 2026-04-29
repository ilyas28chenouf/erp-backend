import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
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

  @Post('callback/:versionId')
  @ApiOperation({ summary: 'ONLYOFFICE callback' })
  callback(@Param('versionId') versionId: string, @Body() body: any) {
    console.log('ONLYOFFICE callback version:', versionId);
    console.log('ONLYOFFICE callback body:', body);

    return { error: 0 };
  }
}