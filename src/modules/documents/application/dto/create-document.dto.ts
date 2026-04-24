import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DocumentType } from '../../domain/enums/document-type.enum';

export class CreateDocumentDto {
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
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  folderId?: string | null;

  @ApiProperty({
    example: 'exam_Levscha_Andrey_Viktorovich.pdf',
  })
  @IsString()
  title: string;

  @ApiProperty({
    enum: DocumentType,
    enumName: 'DocumentType',
    example: DocumentType.OTHER,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  currentVersionNumber?: number;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  createdByUserId?: string | null;
}
