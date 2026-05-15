import { Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { DocumentsService } from '../documents/application/services/documents.service';

type DocumentContextResult =
  | {
      used: true;
      content: string;
      versionId: string;
      documentTitle: string | null;
    }
  | {
      used: false;
      reason?: string;
    };

@Injectable()
export class AiAgentDocumentContextService {
  constructor(private readonly documentsService: DocumentsService) {}

  async resolveDocumentContext(params: {
    explicitDocumentVersionId?: string;
    message: string;
  }): Promise<DocumentContextResult> {
    const documentVersionId =
      params.explicitDocumentVersionId ??
      (await this.tryResolveDocumentVersionIdFromMessage(params.message));

    if (!documentVersionId) {
      return { used: false };
    }

    const { documentVersion, absolutePath } =
      await this.documentsService.getDocumentVersionAbsoluteFilePath(
        documentVersionId,
      );

    try {
      const extractedText = await this.extractTextFromFile(
        absolutePath,
        documentVersion.mimeType,
      );

      return {
        used: true,
        content: extractedText,
        versionId: documentVersion.id,
        documentTitle: documentVersion.document?.title ?? null,
      };
    } catch {
      return {
        used: false,
        reason:
          'Document text could not be extracted yet. OCR support may be required for this file.',
      };
    }
  }

  private async tryResolveDocumentVersionIdFromMessage(message: string) {
    const routeMatch = message.match(
      /\/documents\/(?:files|versions)\/([0-9a-fA-F-]{36})/i,
    );

    if (!routeMatch?.[1]) {
      return undefined;
    }

    const candidateId = routeMatch[1];

    try {
      await this.documentsService.findDocumentVersion(candidateId);
      return candidateId;
    } catch {
      // Continue with document fallback.
    }

    try {
      await this.documentsService.findDocument(candidateId);
      const versions = await this.documentsService.findDocumentVersions({
        documentId: candidateId,
      });

      if (versions.length > 0) {
        return versions[0].id;
      }
    } catch {
      // Ignore unresolved route ids from user text.
    }

    return undefined;
  }

  private async extractTextFromFile(absolutePath: string, mimeType?: string) {
    const extension = path.extname(absolutePath).toLowerCase();

    if (mimeType === 'application/pdf' || extension === '.pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = await readFile(absolutePath);
      const parsed = await pdfParse(buffer);

      if (!parsed.text?.trim()) {
        throw new NotFoundException('PDF text content is empty.');
      }

      return parsed.text.trim();
    }

    if (
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === '.docx'
    ) {
      const mammoth = await import('mammoth');
      const parsed = await mammoth.extractRawText({ path: absolutePath });

      if (!parsed.value?.trim()) {
        throw new NotFoundException('DOCX text content is empty.');
      }

      return parsed.value.trim();
    }

    if (mimeType?.startsWith('text/') || extension === '.txt') {
      const text = await readFile(absolutePath, 'utf8');

      if (!text.trim()) {
        throw new NotFoundException('TXT text content is empty.');
      }

      return text.trim();
    }

    throw new NotFoundException('Unsupported document type for extraction.');
  }
}
