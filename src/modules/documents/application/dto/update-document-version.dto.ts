import { PartialType } from '@nestjs/swagger';
import { CreateDocumentVersionDto } from './create-document-version.dto';

export class UpdateDocumentVersionDto extends PartialType(
  CreateDocumentVersionDto,
) {}
