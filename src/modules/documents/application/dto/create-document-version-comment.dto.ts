import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateDocumentVersionCommentDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  documentVersionId: string;

  @ApiProperty({
    example: 'Please update section 2 before final approval.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
