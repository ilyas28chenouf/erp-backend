import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { DocumentFolderType } from '../../domain/enums/document-folder-type.enum';

export class QueryDocumentFoldersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ enum: DocumentFolderType, enumName: 'DocumentFolderType' })
  @IsOptional()
  @IsEnum(DocumentFolderType)
  type?: DocumentFolderType;
}
