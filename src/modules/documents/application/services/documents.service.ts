import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DOCUMENTS_REPOSITORY,
} from '../../domain/interfaces/documents.repository.interface';
import type { DocumentsRepositoryInterface } from '../../domain/interfaces/documents.repository.interface';
import { CreateDocumentFolderDto } from '../dto/create-document-folder.dto';
import { CreateDocumentVersionDto } from '../dto/create-document-version.dto';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { QueryDocumentFoldersDto } from '../dto/query-document-folders.dto';
import { QueryDocumentVersionsDto } from '../dto/query-document-versions.dto';
import { QueryDocumentsDto } from '../dto/query-documents.dto';
import { UpdateDocumentFolderDto } from '../dto/update-document-folder.dto';
import { UpdateDocumentVersionDto } from '../dto/update-document-version.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DOCUMENTS_REPOSITORY)
    private readonly documentsRepository: DocumentsRepositoryInterface,
  ) {}

  createDocumentFolder(dto: CreateDocumentFolderDto) {
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
      throw new NotFoundException(`Document folder with id "${id}" was not found.`);
    }
    return entity;
  }

  async updateDocumentFolder(id: string, dto: UpdateDocumentFolderDto) {
    const updated = await this.documentsRepository.updateDocumentFolder(id, dto);
    if (!updated) {
      throw new NotFoundException(`Document folder with id "${id}" was not found.`);
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
    return this.documentsRepository.findDocuments(query as Record<string, unknown>);
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

  createDocumentVersion(dto: CreateDocumentVersionDto) {
    return this.documentsRepository.createDocumentVersion(dto);
  }

  findDocumentVersions(query: QueryDocumentVersionsDto) {
    return this.documentsRepository.findDocumentVersions(
      query as Record<string, unknown>,
    );
  }

  async findDocumentVersion(id: string) {
    const entity = await this.documentsRepository.findDocumentVersionById(id);
    if (!entity) {
      throw new NotFoundException(`Document version with id "${id}" was not found.`);
    }
    return entity;
  }

  async updateDocumentVersion(id: string, dto: UpdateDocumentVersionDto) {
    const updated = await this.documentsRepository.updateDocumentVersion(id, dto);
    if (!updated) {
      throw new NotFoundException(`Document version with id "${id}" was not found.`);
    }
    return updated;
  }

  async removeDocumentVersion(id: string) {
    await this.findDocumentVersion(id);
    await this.documentsRepository.removeDocumentVersion(id);
  }
}
