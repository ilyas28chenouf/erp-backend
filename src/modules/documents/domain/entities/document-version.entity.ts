export class DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedByUserId?: string | null;
  comment?: string | null;
  createdAt: Date;
}
