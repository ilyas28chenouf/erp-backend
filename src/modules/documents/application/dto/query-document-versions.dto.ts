import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class QueryDocumentVersionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  documentId?: string;
}
