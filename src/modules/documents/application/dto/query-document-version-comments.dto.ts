import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryDocumentVersionCommentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  documentVersionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorUserId?: string;
}
