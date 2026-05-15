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
import { OllamaService } from './ollama.service';

@Injectable()
export class AiAgentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly aiAgentContextService: AiAgentContextService,
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

    const messages = this.aiAgentContextService.buildMessages(user, message);
    const result = await this.ollamaService.chat(messages);

    return {
      message: result.content,
      provider: result.provider,
      model: result.model,
      sessionId: dto.sessionId,
      createdAt: new Date().toISOString(),
    };
  }
}
