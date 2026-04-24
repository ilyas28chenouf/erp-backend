import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentVersionCommentDto {
  @ApiProperty({
    example: 'Section 2 still needs correction.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
