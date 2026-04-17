import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DocumentType } from '../../domain/enums/document-type.enum';

export class CreateDocumentDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: DocumentType, enumName: 'DocumentType' })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  currentVersionNumber?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;
}
