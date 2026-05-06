import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { CreateDocumentDto } from '../../application/dto/create-document.dto';
import { UploadManyDocumentsDto } from '../../application/dto/upload-many-documents.dto';
import { QueryDocumentsDto } from '../../application/dto/query-documents.dto';
import { UpdateDocumentDto } from '../../application/dto/update-document.dto';
import { DocumentsService } from '../../application/services/documents.service';
import { DocumentType } from '../../domain/enums/document-type.enum';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-many')
  @UseInterceptors(
    FilesInterceptor('files', 50, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          try {
            const tempDir = path.join(getDocumentsStorageRoot(), '_incoming');
            fs.mkdirSync(tempDir, { recursive: true });
            callback(null, tempDir);
          } catch (error) {
            callback(error as Error, '');
          }
        },
        filename: (req, file, callback) => {
          const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
          const safeOriginalName = originalName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
          callback(null, `${Date.now()}-${safeOriginalName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        projectId: {
          type: 'string',
          format: 'uuid',
          nullable: true,
          example: null,
        },
        folderId: {
          type: 'string',
          format: 'uuid',
          nullable: true,
          example: 'uuid',
        },
        documentType: {
          type: 'string',
          enum: Object.values(DocumentType),
          default: DocumentType.OTHER,
          example: DocumentType.OTHER,
        },
        createdByUserId: {
          type: 'string',
          format: 'uuid',
          nullable: true,
          example: null,
        },
        comment: {
          type: 'string',
          nullable: true,
          example: 'Initial upload batch',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload multiple files and create documents with first versions' })
  @ApiResponse({ status: 201, description: 'Documents created from uploaded files.' })
  uploadMany(
    @Body() dto: UploadManyDocumentsDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.documentsService.createDocumentsFromFiles(dto, files);
  }

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

function getDocumentsStorageRoot(): string {
  const storageRoot = process.env.DOCUMENTS_STORAGE_PATH;

  if (!storageRoot) {
    throw new Error('DOCUMENTS_STORAGE_PATH is not configured.');
  }

  return path.resolve(storageRoot);
}
