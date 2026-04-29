import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

import { UsersService } from '../../../users/application/services/users.service';
import { DOCUMENTS_REPOSITORY } from '../../domain/interfaces/documents.repository.interface';
import type { DocumentsRepositoryInterface } from '../../domain/interfaces/documents.repository.interface';

import { CreateDocumentFolderDto } from '../dto/create-document-folder.dto';
import { CreateDocumentVersionCommentDto } from '../dto/create-document-version-comment.dto';
import { CreateDocumentVersionDto } from '../dto/create-document-version.dto';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { QueryDocumentFoldersDto } from '../dto/query-document-folders.dto';
import { QueryDocumentVersionCommentsDto } from '../dto/query-document-version-comments.dto';
import { QueryDocumentVersionsDto } from '../dto/query-document-versions.dto';
import { QueryDocumentsDto } from '../dto/query-documents.dto';
import { UpdateDocumentFolderDto } from '../dto/update-document-folder.dto';
import { UpdateDocumentVersionCommentDto } from '../dto/update-document-version-comment.dto';
import { UpdateDocumentVersionDto } from '../dto/update-document-version.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

const MAX_FOLDER_DEPTH = 3;

type MutableDocumentUpdate = {
  currentVersionNumber?: number;
};

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DOCUMENTS_REPOSITORY)
    private readonly documentsRepository: DocumentsRepositoryInterface,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async createDocumentFolder(dto: CreateDocumentFolderDto) {
    await this.validateFolderHierarchy(dto);
    return this.documentsRepository.createDocumentFolder(dto);
  }

  findDocumentFolders(query: QueryDocumentFoldersDto) {
    return this.documentsRepository.findDocumentFolders(
      query as Record<string, unknown>,
    );
  }

  async findDocumentFolder(id: string) {
    const entity = await this.documentsRepository.findDocumentFolderById(id);
    if (!entity) {
      throw new NotFoundException(
        `Document folder with id "${id}" was not found.`,
      );
    }
    return entity;
  }

  async updateDocumentFolder(id: string, dto: UpdateDocumentFolderDto) {
    await this.findDocumentFolder(id);
    await this.validateFolderHierarchy(dto, id);

    const updated = await this.documentsRepository.updateDocumentFolder(id, dto);
    if (!updated) {
      throw new NotFoundException(
        `Document folder with id "${id}" was not found.`,
      );
    }
    return updated;
  }

  async removeDocumentFolder(id: string) {
    await this.findDocumentFolder(id);
    await this.documentsRepository.removeDocumentFolder(id);
  }

  createDocument(dto: CreateDocumentDto) {
    return this.documentsRepository.createDocument({
      ...dto,
      currentVersionNumber: dto.currentVersionNumber ?? 1,
    });
  }

  findDocuments(query: QueryDocumentsDto) {
    return this.documentsRepository.findDocuments(
      query as Record<string, unknown>,
    );
  }

  async findDocument(id: string) {
    const entity = await this.documentsRepository.findDocumentById(id);
    if (!entity) {
      throw new NotFoundException(`Document with id "${id}" was not found.`);
    }
    return entity;
  }

  async updateDocument(id: string, dto: UpdateDocumentDto) {
    const updated = await this.documentsRepository.updateDocument(id, dto);
    if (!updated) {
      throw new NotFoundException(`Document with id "${id}" was not found.`);
    }
    return updated;
  }

  async removeDocument(id: string) {
    await this.findDocument(id);
    await this.documentsRepository.removeDocument(id);
  }

  async createDocumentVersion(
    dto: CreateDocumentVersionDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    await this.findDocument(dto.documentId);

    if (dto.uploadedByUserId) {
      await this.usersService.findOne(dto.uploadedByUserId);
    }

    const latestVersion =
      await this.documentsRepository.findLatestDocumentVersion(dto.documentId);
    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

    // Keep storage layout consistent with your real files:
    // /home/mekdev/storage/erp-documents/<documentId>/<filename>
    const relativeDirectory = dto.documentId;
    const relativeFilePath = path
      .join(relativeDirectory, file.filename)
      .replace(/\\/g, '/');

    const createdVersion = await this.documentsRepository.createDocumentVersion({
      documentId: dto.documentId,
      versionNumber,
      fileName: file.originalname,
      filePath: relativeFilePath,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedByUserId: dto.uploadedByUserId ?? null,
      comment: dto.comment ?? null,
    });

    await this.documentsRepository.updateDocument(dto.documentId, {
      currentVersionNumber: versionNumber,
    } as MutableDocumentUpdate);

    return createdVersion;
  }

  findDocumentVersions(query: QueryDocumentVersionsDto) {
    return this.documentsRepository.findDocumentVersions(
      query as Record<string, unknown>,
    );
  }

  async findDocumentVersion(id: string) {
    const entity = await this.documentsRepository.findDocumentVersionById(id);
    if (!entity) {
      throw new NotFoundException(
        `Document version with id "${id}" was not found.`,
      );
    }
    return entity;
  }

  async updateDocumentVersion(id: string, dto: UpdateDocumentVersionDto) {
    const updated = await this.documentsRepository.updateDocumentVersion(id, dto);
    if (!updated) {
      throw new NotFoundException(
        `Document version with id "${id}" was not found.`,
      );
    }
    return updated;
  }

  async removeDocumentVersion(id: string) {
    await this.findDocumentVersion(id);
    await this.documentsRepository.removeDocumentVersion(id);
  }

  async getDocumentVersionFile(id: string) {
    const documentVersion = await this.findDocumentVersion(id);
    const storageRoot = this.getDocumentsStorageRoot();
    const absoluteFilePath = path.resolve(storageRoot, documentVersion.filePath);

    if (!absoluteFilePath.startsWith(storageRoot)) {
      throw new BadRequestException('Invalid stored file path.');
    }

    if (!existsSync(absoluteFilePath)) {
      throw new NotFoundException('Stored file was not found on disk.');
    }

    return {
      documentVersion,
      file: new StreamableFile(createReadStream(absoluteFilePath)),
    };
  }

  async getDocumentVersionAbsoluteFilePath(id: string) {
    const documentVersion = await this.findDocumentVersion(id);
    const storageRoot = this.getDocumentsStorageRoot();
    const absolutePath = path.resolve(storageRoot, documentVersion.filePath);

    if (!absolutePath.startsWith(storageRoot)) {
      throw new BadRequestException('Invalid stored file path.');
    }

    if (!existsSync(absolutePath)) {
      throw new NotFoundException('Stored file was not found on disk.');
    }

    return {
      documentVersion,
      absolutePath,
    };
  }

  async createDocumentVersionComment(
    dto: CreateDocumentVersionCommentDto,
    authorUserId: string,
  ) {
    await this.findDocumentVersion(dto.documentVersionId);
    await this.usersService.findOne(authorUserId);

    return this.documentsRepository.createDocumentVersionComment({
      ...dto,
      authorUserId,
    });
  }

  findDocumentVersionComments(query: QueryDocumentVersionCommentsDto) {
    return this.documentsRepository.findDocumentVersionComments(
      query as Record<string, unknown>,
    );
  }

  async findDocumentVersionComment(id: string) {
    const entity = await this.documentsRepository.findDocumentVersionCommentById(
      id,
    );
    if (!entity) {
      throw new NotFoundException(
        `Document version comment with id "${id}" was not found.`,
      );
    }
    return entity;
  }

  async updateDocumentVersionComment(
    id: string,
    dto: UpdateDocumentVersionCommentDto,
  ) {
    const updated = await this.documentsRepository.updateDocumentVersionComment(
      id,
      dto,
    );
    if (!updated) {
      throw new NotFoundException(
        `Document version comment with id "${id}" was not found.`,
      );
    }
    return updated;
  }

  async removeDocumentVersionComment(id: string) {
    await this.findDocumentVersionComment(id);
    await this.documentsRepository.removeDocumentVersionComment(id);
  }

async saveOnlyOfficeEditedVersion(
  sourceVersionId: string,
  downloadUrl: string,
  fileType?: string,
) {
  const sourceVersion = await this.findDocumentVersion(sourceVersionId);

  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new InternalServerErrorException(
      `ONLYOFFICE file download failed with status ${response.status}.`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const storageRoot = this.getDocumentsStorageRoot();
  const absoluteFilePath = path.resolve(storageRoot, sourceVersion.filePath);

  if (!absoluteFilePath.startsWith(storageRoot)) {
    throw new BadRequestException('Invalid stored file path.');
  }

  const absoluteDirectory = path.dirname(absoluteFilePath);
  await fs.mkdir(absoluteDirectory, { recursive: true });

  await fs.writeFile(absoluteFilePath, buffer);

  const originalExt =
    fileType?.replace('.', '') ||
    path.extname(sourceVersion.fileName).replace('.', '') ||
    'bin';

  const updatedVersion = await this.documentsRepository.updateDocumentVersion(
    sourceVersion.id,
    {
      mimeType: this.resolveMimeTypeFromExtension(
        originalExt,
        sourceVersion.mimeType,
      ),
      sizeBytes: buffer.byteLength,
      comment: 'Saved from ONLYOFFICE',
    },
  );

  if (!updatedVersion) {
    throw new NotFoundException(
      `Document version with id "${sourceVersion.id}" was not found.`,
    );
  }

  return updatedVersion;
}
  private async validateFolderHierarchy(
    dto: Pick<CreateDocumentFolderDto, 'parentFolderId'>,
    currentFolderId?: string,
  ): Promise<void> {
    if (dto.parentFolderId === undefined) {
      return;
    }

    if (!dto.parentFolderId) {
      if (currentFolderId) {
        const subtreeHeight = await this.getFolderSubtreeHeight(currentFolderId);
        if (subtreeHeight > MAX_FOLDER_DEPTH) {
          throw new BadRequestException(
            'Folder nesting depth must not exceed 3 levels.',
          );
        }
      }
      return;
    }

    if (currentFolderId && dto.parentFolderId === currentFolderId) {
      throw new BadRequestException('Folder cannot reference itself as parent.');
    }

    const parentFolder = await this.documentsRepository.findDocumentFolderById(
      dto.parentFolderId,
    );

    if (!parentFolder) {
      throw new BadRequestException(
        'Invalid parentFolderId: parent folder was not found.',
      );
    }

    const parentDepth = await this.getFolderDepth(
      dto.parentFolderId,
      currentFolderId,
    );
    const subtreeHeight = currentFolderId
      ? await this.getFolderSubtreeHeight(currentFolderId)
      : 1;

    if (parentDepth + subtreeHeight > MAX_FOLDER_DEPTH) {
      throw new BadRequestException(
        'Folder nesting depth must not exceed 3 levels.',
      );
    }
  }

  private async getFolderDepth(
    folderId: string,
    movingFolderId?: string,
  ): Promise<number> {
    let depth = 1;
    let currentId: string | null | undefined = folderId;
    const visited = new Set<string>();

    while (currentId) {
      if (visited.has(currentId)) {
        throw new BadRequestException('Folder loop detected in parent hierarchy.');
      }
      visited.add(currentId);

      const folder = await this.documentsRepository.findDocumentFolderById(
        currentId,
      );
      if (!folder) {
        throw new BadRequestException(
          'Invalid parentFolderId: parent folder was not found.',
        );
      }

      const nextParentId = folder.parentFolderId;
      if (movingFolderId && nextParentId === movingFolderId) {
        throw new BadRequestException('Folder parent loop detected.');
      }

      if (nextParentId) {
        depth += 1;
      }

      currentId = nextParentId;
    }

    return depth;
  }

  private async getFolderSubtreeHeight(folderId: string): Promise<number> {
    const childFolders = await this.documentsRepository.findDocumentFolders({
      parentFolderId: folderId,
    } as Record<string, unknown>);

    if (childFolders.length === 0) {
      return 1;
    }

    const childHeights = await Promise.all(
      childFolders.map((childFolder) =>
        this.getFolderSubtreeHeight(childFolder.id),
      ),
    );

    return 1 + Math.max(...childHeights);
  }

  private getDocumentsStorageRoot(): string {
    const storageRoot = this.configService.get<string>('DOCUMENTS_STORAGE_PATH');

    if (!storageRoot) {
      throw new BadRequestException(
        'DOCUMENTS_STORAGE_PATH is not configured.',
      );
    }

    return path.resolve(storageRoot);
  }

  private resolveMimeTypeFromExtension(ext: string, fallback?: string): string {
    const normalized = ext.toLowerCase();

    const map: Record<string, string> = {
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xls: 'application/vnd.ms-excel',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ppt: 'application/vnd.ms-powerpoint',
      pdf: 'application/pdf',
      txt: 'text/plain',
      csv: 'text/csv',
      odt: 'application/vnd.oasis.opendocument.text',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odp: 'application/vnd.oasis.opendocument.presentation',
      rtf: 'application/rtf',
    };

    return map[normalized] ?? fallback ?? 'application/octet-stream';
  }
}