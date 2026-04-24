import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDocumentFoldersDto } from '../../application/dto/query-document-folders.dto';
import { QueryDocumentVersionCommentsDto } from '../../application/dto/query-document-version-comments.dto';
import { QueryDocumentVersionsDto } from '../../application/dto/query-document-versions.dto';
import { QueryDocumentsDto } from '../../application/dto/query-documents.dto';
import { DocumentsRepositoryInterface } from '../../domain/interfaces/documents.repository.interface';
import { DocumentFolderOrmEntity } from '../persistence/document-folder.orm-entity';
import { DocumentVersionCommentOrmEntity } from '../persistence/document-version-comment.orm-entity';
import { DocumentOrmEntity } from '../persistence/document.orm-entity';
import { DocumentVersionOrmEntity } from '../persistence/document-version.orm-entity';

@Injectable()
export class DocumentsRepository implements DocumentsRepositoryInterface {
  constructor(
    @InjectRepository(DocumentFolderOrmEntity)
    private readonly documentFoldersRepository: Repository<DocumentFolderOrmEntity>,
    @InjectRepository(DocumentOrmEntity)
    private readonly documentsRepository: Repository<DocumentOrmEntity>,
    @InjectRepository(DocumentVersionOrmEntity)
    private readonly documentVersionsRepository: Repository<DocumentVersionOrmEntity>,
    @InjectRepository(DocumentVersionCommentOrmEntity)
    private readonly documentVersionCommentsRepository: Repository<DocumentVersionCommentOrmEntity>,
  ) {}

  createDocumentFolder(entity: Partial<DocumentFolderOrmEntity>) {
    return this.documentFoldersRepository.save(
      this.documentFoldersRepository.create(entity),
    );
  }

  findDocumentFolders(filters?: QueryDocumentFoldersDto) {
    return this.documentFoldersRepository.find({
      where: {
        projectId: filters?.projectId,
        parentFolderId: filters?.parentFolderId,
        type: filters?.type,
      },
      relations: {
        project: true,
        parentFolder: true,
        childFolders: true,
        documents: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findDocumentFolderById(id: string) {
    return this.documentFoldersRepository.findOne({
      where: { id },
      relations: {
        project: true,
        parentFolder: true,
        childFolders: true,
        documents: true,
      },
    });
  }

  async updateDocumentFolder(
    id: string,
    payload: Partial<DocumentFolderOrmEntity>,
  ) {
    const existing = await this.findDocumentFolderById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.documentFoldersRepository.save(existing);
  }

  async removeDocumentFolder(id: string) {
    await this.documentFoldersRepository.delete(id);
  }

  createDocument(entity: Partial<DocumentOrmEntity>) {
    return this.documentsRepository.save(this.documentsRepository.create(entity));
  }

  findDocuments(filters?: QueryDocumentsDto) {
    return this.documentsRepository.find({
      where: {
        projectId: filters?.projectId,
        folderId: filters?.folderId,
        documentType: filters?.documentType,
      },
      relations: {
        project: true,
        folder: true,
        createdByUser: true,
        versions: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  findDocumentById(id: string) {
    return this.documentsRepository.findOne({
      where: { id },
      relations: {
        project: true,
        folder: true,
        createdByUser: true,
        versions: true,
      },
    });
  }

  async updateDocument(id: string, payload: Partial<DocumentOrmEntity>) {
    const existing = await this.findDocumentById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.documentsRepository.save(existing);
  }

  async removeDocument(id: string) {
    await this.documentsRepository.delete(id);
  }

  createDocumentVersion(entity: Partial<DocumentVersionOrmEntity>) {
    return this.documentVersionsRepository.save(
      this.documentVersionsRepository.create(entity),
    );
  }

  findDocumentVersions(filters?: QueryDocumentVersionsDto) {
    const queryBuilder = this.documentVersionsRepository
      .createQueryBuilder('documentVersion')
      .leftJoinAndSelect('documentVersion.document', 'document')
      .leftJoinAndSelect('documentVersion.uploadedByUser', 'uploadedByUser')
      .orderBy('documentVersion.createdAt', 'DESC');

    if (filters?.documentId) {
      queryBuilder.andWhere('documentVersion.documentId = :documentId', {
        documentId: filters.documentId,
      });
    }

    return queryBuilder.getMany();
  }

  findDocumentVersionById(id: string) {
    return this.documentVersionsRepository.findOne({
      where: { id },
      relations: {
        document: true,
        uploadedByUser: true,
      },
    });
  }

  findLatestDocumentVersion(documentId: string) {
    return this.documentVersionsRepository.findOne({
      where: { documentId },
      order: { versionNumber: 'DESC' },
    });
  }

  async updateDocumentVersion(
    id: string,
    payload: Partial<DocumentVersionOrmEntity>,
  ) {
    const existing = await this.findDocumentVersionById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.documentVersionsRepository.save(existing);
  }

  async removeDocumentVersion(id: string) {
    await this.documentVersionsRepository.delete(id);
  }

  createDocumentVersionComment(entity: Partial<DocumentVersionCommentOrmEntity>) {
    return this.documentVersionCommentsRepository.save(
      this.documentVersionCommentsRepository.create(entity),
    );
  }

  findDocumentVersionComments(filters?: QueryDocumentVersionCommentsDto) {
    return this.documentVersionCommentsRepository.find({
      where: {
        documentVersionId: filters?.documentVersionId,
        authorUserId: filters?.authorUserId,
      },
      relations: {
        documentVersion: true,
        authorUser: true,
      },
      order: { createdAt: 'ASC' },
    });
  }

  findDocumentVersionCommentById(id: string) {
    return this.documentVersionCommentsRepository.findOne({
      where: { id },
      relations: {
        documentVersion: true,
        authorUser: true,
      },
    });
  }

  async updateDocumentVersionComment(
    id: string,
    payload: Partial<DocumentVersionCommentOrmEntity>,
  ) {
    const existing = await this.findDocumentVersionCommentById(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, payload);
    return this.documentVersionCommentsRepository.save(existing);
  }

  async removeDocumentVersionComment(id: string) {
    await this.documentVersionCommentsRepository.delete(id);
  }
}
