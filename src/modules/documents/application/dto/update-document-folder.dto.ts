import { PartialType } from '@nestjs/swagger';
import { CreateDocumentFolderDto } from './create-document-folder.dto';

export class UpdateDocumentFolderDto extends PartialType(
  CreateDocumentFolderDto,
) {}
