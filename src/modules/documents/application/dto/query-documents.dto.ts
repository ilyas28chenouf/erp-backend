import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DocumentType } from '../../domain/enums/document-type.enum';

export class QueryDocumentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @ApiPropertyOptional({ enum: DocumentType, enumName: 'DocumentType' })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}
