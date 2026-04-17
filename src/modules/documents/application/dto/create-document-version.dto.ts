import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateDocumentVersionDto {
  @ApiProperty()
  @IsUUID()
  documentId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  versionNumber: number;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  filePath: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  sizeBytes: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsUUID()
  uploadedByUserId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
