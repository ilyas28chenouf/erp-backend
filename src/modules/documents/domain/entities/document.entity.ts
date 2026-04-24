import { DocumentType } from '../enums/document-type.enum';

export class Document {
  id: string;
  projectId?: string | null;
  folderId?: string | null;
  title: string;
  documentType: DocumentType;
  currentVersionNumber: number;
  createdByUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
