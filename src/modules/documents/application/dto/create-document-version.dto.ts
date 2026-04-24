import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDocumentVersionDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  documentId: string;

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
