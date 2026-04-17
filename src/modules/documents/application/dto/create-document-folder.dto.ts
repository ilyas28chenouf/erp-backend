import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { DocumentFolderType } from '../../domain/enums/document-folder-type.enum';

export class CreateDocumentFolderDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: DocumentFolderType, enumName: 'DocumentFolderType' })
  @IsEnum(DocumentFolderType)
  type: DocumentFolderType;
}
