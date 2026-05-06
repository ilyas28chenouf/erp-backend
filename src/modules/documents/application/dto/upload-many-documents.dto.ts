import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentType } from '../../domain/enums/document-type.enum';

export class UploadManyDocumentsDto {
  @ApiPropertyOptional({ nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'uuid' })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;

  @ApiPropertyOptional({
    enum: DocumentType,
    enumName: 'DocumentType',
    example: DocumentType.OTHER,
    default: DocumentType.OTHER,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    example: 'Initial upload batch',
  })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
