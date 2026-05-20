import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class MarkManyActionLogsSyncedDto {
  @ApiProperty({
    example: [
      '2e1b7d2a-63b0-41d1-b5a6-76b8e57704a1',
      'f8bf2cf3-0782-41b0-9ce2-94930a9b9015',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids: string[];
}
