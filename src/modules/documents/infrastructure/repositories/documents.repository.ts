import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDocumentFoldersDto } from '../../application/dto/query-document-folders.dto';
import { QueryDocumentVersionCommentsDto } from '../../application/dto/query-document-version-comments.dto';
import { QueryDocumentVersionsDto } from '../../application/dto/query-document-versions.dto';
import { QueryDocumentsDto } from '../../application/dto/query-documents.dto';
import { DocumentsRepositoryInterface } from '../../domain/interfaces/documents.repository.interface';

import { DocumentFolderOrmEntity } from '../persistence/document-folder.orm-entity';
import { DocumentOrmEntity } from '../persistence/document.orm-entity';
import { DocumentVersionCommentOrmEntity } from '../persistence/document-version-comment.orm-entity';
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
    const queryBuilder = this.documentFoldersRepository
      .createQueryBuilder('documentFolder')
      .leftJoinAndSelect('documentFolder.project', 'project')
      .leftJoinAndSelect('documentFolder.parentFolder', 'parentFolder')
      .leftJoinAndSelect('documentFolder.childFolders', 'childFolders')
      .leftJoinAndSelect('documentFolder.documents', 'documents')
      .orderBy('documentFolder.createdAt', 'DESC');

    if (filters?.projectId !== undefined) {
      if (filters.projectId === null) {
        queryBuilder.andWhere('documentFolder.projectId IS NULL');
      } else {
        queryBuilder.andWhere('documentFolder.projectId = :projectId', {
          projectId: filters.projectId,
        });
      }
    }

    if (filters?.parentFolderId !== undefined) {
      if (filters.parentFolderId === null) {
        queryBuilder.andWhere('documentFolder.parentFolderId IS NULL');
      } else {
        queryBuilder.andWhere('documentFolder.parentFolderId = :parentFolderId', {
          parentFolderId: filters.parentFolderId,
        });
      }
    }

    if (filters?.type) {
      queryBuilder.andWhere('documentFolder.type = :type', {
        type: filters.type,
      });
    }

    return queryBuilder.getMany();
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
    const queryBuilder = this.documentsRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.project', 'project')
      .leftJoinAndSelect('document.folder', 'folder')
      .leftJoinAndSelect('document.createdByUser', 'createdByUser')
      .leftJoinAndSelect('document.versions', 'versions')
      .orderBy('document.createdAt', 'DESC');

    if (filters?.projectId !== undefined) {
      if (filters.projectId === null) {
        queryBuilder.andWhere('document.projectId IS NULL');
      } else {
        queryBuilder.andWhere('document.projectId = :projectId', {
          projectId: filters.projectId,
        });
      }
    }

    if (filters?.folderId !== undefined) {
      if (filters.folderId === null) {
        queryBuilder.andWhere('document.folderId IS NULL');
      } else {
        queryBuilder.andWhere('document.folderId = :folderId', {
          folderId: filters.folderId,
        });
      }
    }

    if (filters?.documentType) {
      queryBuilder.andWhere('document.documentType = :documentType', {
        documentType: filters.documentType,
      });
    }

    return queryBuilder.getMany();
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
      .orderBy('documentVersion.versionNumber', 'DESC')
      .addOrderBy('documentVersion.createdAt', 'DESC');

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
    const queryBuilder = this.documentVersionCommentsRepository
      .createQueryBuilder('documentVersionComment')
      .leftJoinAndSelect('documentVersionComment.documentVersion', 'documentVersion')
      .leftJoinAndSelect('documentVersionComment.authorUser', 'authorUser')
      .orderBy('documentVersionComment.createdAt', 'ASC');

    if (filters?.documentVersionId) {
      queryBuilder.andWhere(
        'documentVersionComment.documentVersionId = :documentVersionId',
        { documentVersionId: filters.documentVersionId },
      );
    }

    if (filters?.authorUserId) {
      queryBuilder.andWhere('documentVersionComment.authorUserId = :authorUserId', {
        authorUserId: filters.authorUserId,
      });
    }

    return queryBuilder.getMany();
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