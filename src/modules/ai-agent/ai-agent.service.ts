import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { AiAgentChatDto } from './dto/ai-agent-chat.dto';
import { AiAgentChatResponseDto } from './dto/ai-agent-chat-response.dto';
import { AiAgentContextService } from './ai-agent-context.service';
import { AiAgentDocumentContextService } from './ai-agent-document-context.service';
import { OllamaService } from './ollama.service';

@Injectable()
export class AiAgentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly aiAgentContextService: AiAgentContextService,
    private readonly aiAgentDocumentContextService: AiAgentDocumentContextService,
    private readonly ollamaService: OllamaService,
  ) {}

  async chat(
    dto: AiAgentChatDto,
    user: UserOrmEntity,
  ): Promise<AiAgentChatResponseDto> {
    const isEnabled =
      this.configService.get<string>('AI_AGENT_ENABLED', 'false') === 'true';

    if (!isEnabled) {
      throw new ServiceUnavailableException('AI agent is disabled.');
    }

    const provider = this.configService.get<string>('AI_PROVIDER', 'ollama');
    if (provider !== 'ollama') {
      throw new ServiceUnavailableException(
        `AI provider "${provider}" is not supported in this environment.`,
      );
    }

    const message = dto.message.trim();
    if (!message) {
      throw new BadRequestException('Message must not be empty.');
    }

    const language = this.aiAgentContextService.detectPreferredLanguage(
      user,
      message,
    );
    const documentContext =
      await this.aiAgentDocumentContextService.resolveDocumentContext({
        explicitDocumentVersionId: dto.documentVersionId,
        message,
      });

    if (!documentContext.used && documentContext.reason) {
      return {
        message:
          language === 'ru'
            ? 'Не удалось извлечь текст выбранного документа. Для таких файлов позже потребуется OCR.'
            : 'The selected document text could not be extracted yet. OCR support will be needed later for this file.',
        provider,
        model: this.configService.get<string>('AI_AGENT_MODEL', 'qwen2.5:7b'),
        sessionId: dto.sessionId,
        createdAt: new Date().toISOString(),
        documentContextUsed: false,
      };
    }

    const messages = this.aiAgentContextService.buildMessages({
      user,
      userMessage: message,
      history: dto.messages,
      documentContext: documentContext.used ? documentContext.content : null,
    });
    const result = await this.ollamaService.chat(messages);

    return {
      message: result.content,
      provider: result.provider,
      model: result.model,
      sessionId: dto.sessionId,
      createdAt: new Date().toISOString(),
      documentContextUsed: documentContext.used,
    };
  }
}
