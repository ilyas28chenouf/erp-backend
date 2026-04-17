import { DocumentFolderOrmEntity } from '../../infrastructure/persistence/document-folder.orm-entity';
import { DocumentOrmEntity } from '../../infrastructure/persistence/document.orm-entity';
import { DocumentVersionOrmEntity } from '../../infrastructure/persistence/document-version.orm-entity';

export interface DocumentsRepositoryInterface {
  createDocumentFolder(entity: Partial<DocumentFolderOrmEntity>): Promise<DocumentFolderOrmEntity>;
  findDocumentFolders(filters?: Record<string, unknown>): Promise<DocumentFolderOrmEntity[]>;
  findDocumentFolderById(id: string): Promise<DocumentFolderOrmEntity | null>;
  updateDocumentFolder(
    id: string,
    payload: Partial<DocumentFolderOrmEntity>,
  ): Promise<DocumentFolderOrmEntity | null>;
  removeDocumentFolder(id: string): Promise<void>;
  createDocument(entity: Partial<DocumentOrmEntity>): Promise<DocumentOrmEntity>;
  findDocuments(filters?: Record<string, unknown>): Promise<DocumentOrmEntity[]>;
  findDocumentById(id: string): Promise<DocumentOrmEntity | null>;
  updateDocument(
    id: string,
    payload: Partial<DocumentOrmEntity>,
  ): Promise<DocumentOrmEntity | null>;
  removeDocument(id: string): Promise<void>;
  createDocumentVersion(
    entity: Partial<DocumentVersionOrmEntity>,
  ): Promise<DocumentVersionOrmEntity>;
  findDocumentVersions(filters?: Record<string, unknown>): Promise<DocumentVersionOrmEntity[]>;
  findDocumentVersionById(id: string): Promise<DocumentVersionOrmEntity | null>;
  updateDocumentVersion(
    id: string,
    payload: Partial<DocumentVersionOrmEntity>,
  ): Promise<DocumentVersionOrmEntity | null>;
  removeDocumentVersion(id: string): Promise<void>;
}

export const DOCUMENTS_REPOSITORY = Symbol('DOCUMENTS_REPOSITORY');
