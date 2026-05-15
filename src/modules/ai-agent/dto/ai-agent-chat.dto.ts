import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class AiAgentHistoryMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  @IsString()
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'Can you summarize this contract?' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ example: '2026-05-15T12:00:00.000Z' })
  @IsOptional()
  @IsString()
  createdAt?: string;
}

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

  @ApiPropertyOptional({
    type: [AiAgentHistoryMessageDto],
    example: [
      {
        role: 'user',
        content: 'Привет, что ты умеешь?',
        createdAt: '2026-05-15T12:00:00.000Z',
      },
      {
        role: 'assistant',
        content: 'Я MEC AI Agent и могу помочь с ERP-контекстом.',
        createdAt: '2026-05-15T12:00:04.000Z',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiAgentHistoryMessageDto)
  messages?: AiAgentHistoryMessageDto[];

  @ApiPropertyOptional({
    example: '6f5d1da8-4aa6-4f72-9860-8d6dfc8fa1b0',
    description: 'Optional ERP document version id to read and add as AI context.',
  })
  @IsOptional()
  @IsUUID()
  documentVersionId?: string;
}
