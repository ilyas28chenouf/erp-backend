import { DocumentFolderType } from '../enums/document-folder-type.enum';

export class DocumentFolder {
  id: string;
  projectId: string;
  name: string;
  type: DocumentFolderType;
  createdAt: Date;
  updatedAt: Date;
}
