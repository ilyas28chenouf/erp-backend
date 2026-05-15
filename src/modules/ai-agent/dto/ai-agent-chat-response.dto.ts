import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AiAgentChatResponseDto {
  @ApiProperty({
    example:
      'Привет, Ильяс. Я могу помочь с общими вопросами по ERP. Для точного расчета данных мне потребуется подключение ERP-инструментов.',
  })
  message: string;

  @ApiProperty({ example: 'ollama' })
  provider: string;

  @ApiProperty({ example: 'qwen2.5:7b' })
  model: string;

  @ApiPropertyOptional({ example: 'session-123' })
  sessionId?: string;

  @ApiProperty({ example: '2026-05-15T12:00:00.000Z' })
  createdAt: string;
}
