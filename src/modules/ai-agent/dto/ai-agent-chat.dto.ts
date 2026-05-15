import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class AiAgentChatDto {
  @ApiProperty({
    example: 'Give me total service lines this year',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  message: string;

  @ApiPropertyOptional({
    example: 'session-123',
    description: 'Optional temporary client session identifier.',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
