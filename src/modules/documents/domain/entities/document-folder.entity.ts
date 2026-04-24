import { DocumentFolderType } from '../enums/document-folder-type.enum';

export class DocumentFolder {
  id: string;
  projectId?: string | null;
  parentFolderId?: string | null;
  name: string;
  type: DocumentFolderType;
  createdAt: Date;
  updatedAt: Date;
}
