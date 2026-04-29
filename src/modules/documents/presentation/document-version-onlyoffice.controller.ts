import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../../auth/presentation/decorators/public.decorator';
import { DocumentsService } from '../application/services/documents.service';

type OnlyOfficeCallbackBody = {
  status?: number;
  url?: string;
  filetype?: string;
  key?: string;
  users?: string[];
  actions?: Array<{ type: number; userid: string }>;
  forcesavetype?: number;
};

@ApiTags('Document Versions ONLYOFFICE')
@Controller('documents/versions')
export class DocumentVersionOnlyOfficeController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Public()
  @Get(':id/file-onlyoffice')
  @ApiOperation({ summary: 'Get document version file for ONLYOFFICE' })
  @ApiResponse({ status: 200, description: 'Document version file returned.' })
  async getFileForOnlyOffice(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { documentVersion, absolutePath } =
      await this.documentsService.getDocumentVersionAbsoluteFilePath(id);

    return res.sendFile(absolutePath, {
      headers: {
        'Content-Type': documentVersion.mimeType,
        'Content-Disposition': `inline; filename="${encodeURIComponent(
          documentVersion.fileName,
        )}"`,
      },
    });
  }

  @Public()
  @Post('callback/:versionId')
  @ApiOperation({ summary: 'ONLYOFFICE callback' })
  @ApiResponse({ status: 200, description: 'ONLYOFFICE callback handled.' })
  async callback(
    @Param('versionId') versionId: string,
    @Body() body: OnlyOfficeCallbackBody,
  ) {
    try {
      if (!body || typeof body.status !== 'number') {
        throw new BadRequestException('Invalid ONLYOFFICE callback payload.');
      }

      // 1 = editing in progress
      // 2 = ready for saving
      // 4 = closed with no changes
      // 6 = force save current state
      // ONLYOFFICE requires { error: 0 } on success.
      if (body.status === 2 || body.status === 6) {
        if (!body.url) {
          throw new BadRequestException(
            'ONLYOFFICE callback did not provide file url.',
          );
        }

        await this.documentsService.saveOnlyOfficeEditedVersion(
          versionId,
          body.url,
          body.filetype,
        );
      }

      return { error: 0 };
    } catch (error) {
      console.error('ONLYOFFICE callback failed:', error);
      return { error: 1 };
    }
  }
}