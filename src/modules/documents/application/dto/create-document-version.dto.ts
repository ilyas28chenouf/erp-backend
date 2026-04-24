import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateDocumentVersionDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  documentId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  versionNumber: number;

  @ApiProperty({ example: 'contract-v2.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: '/documents/contracts/contract-v2.pdf' })
  @IsString()
  filePath: string;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 234567 })
  @IsInt()
  @Min(0)
  sizeBytes: number;

  @ApiProperty({ required: false, nullable: true, example: null })
  @IsOptional()
  @IsUUID()
  uploadedByUserId?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Updated after customer corrections',
  })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
