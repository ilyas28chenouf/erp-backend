import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentVersionDto } from '../../application/dto/create-document-version.dto';
import { QueryDocumentVersionsDto } from '../../application/dto/query-document-versions.dto';
import { UpdateDocumentVersionDto } from '../../application/dto/update-document-version.dto';
import { DocumentsService } from '../../application/services/documents.service';

function getDocumentsStorageRoot(): string {
  const storageRoot = process.env.DOCUMENTS_STORAGE_PATH;

  if (!storageRoot) {
    throw new Error('DOCUMENTS_STORAGE_PATH is not configured.');
  }

  return path.resolve(storageRoot);
}

@ApiTags('Document Versions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents/versions')
export class DocumentVersionsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          try {
            const documentId = String(req.body.documentId ?? '').trim();
            const uploadDir = path.join(
              getDocumentsStorageRoot(),
              documentId || 'unknown',
            );

            fs.mkdirSync(uploadDir, { recursive: true });
            callback(null, uploadDir);
          } catch (error) {
            callback(error as Error, '');
          }
        },
        filename: (req, file, callback) => {
          const safeOriginalName = file.originalname.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
          callback(null, `${Date.now()}-${safeOriginalName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['documentId', 'file'],
      properties: {
        documentId: {
          type: 'string',
          format: 'uuid',
          example: 'uuid',
        },
        uploadedByUserId: {
          type: 'string',
          format: 'uuid',
          nullable: true,
          example: null,
        },
        comment: {
          type: 'string',
          nullable: true,
          example: 'Updated after customer corrections',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload a new document version file' })
  @ApiResponse({ status: 201, description: 'Document version created.' })
  create(
    @Body() dto: CreateDocumentVersionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentsService.createDocumentVersion(dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'List document versions' })
  @ApiResponse({ status: 200, description: 'Document versions returned.' })
  findAll(@Query() query: QueryDocumentVersionsDto) {
    return this.documentsService.findDocumentVersions(query);
  }

  @Get(':id/file')
  @ApiOperation({ summary: 'Download document version file' })
  @ApiResponse({ status: 200, description: 'Document version file returned.' })
  async getFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const { documentVersion, file } = await this.documentsService.getDocumentVersionFile(
      id,
    );

    res.setHeader('Content-Type', documentVersion.mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(documentVersion.fileName)}"`,
    );

    return file;
  }

 @UseGuards()
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
