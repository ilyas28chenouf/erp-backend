import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { DocumentFolderType } from '../../domain/enums/document-folder-type.enum';

export class CreateDocumentFolderDto {
  @ApiProperty({
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptional()
  @IsUUID()
  projectId?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptional()
  @IsUUID()
  parentFolderId?: string | null;

  @ApiProperty({ example: 'Contracts 2026' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: DocumentFolderType,
    enumName: 'DocumentFolderType',
    example: DocumentFolderType.CONTRACTS,
  })
  @IsEnum(DocumentFolderType)
  type: DocumentFolderType;
}
