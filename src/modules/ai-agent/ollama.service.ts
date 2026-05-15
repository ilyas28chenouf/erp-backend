import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiAgentMessage } from './ai-agent-context.service';

interface OllamaChatRequest {
  model: string;
  messages: AiAgentMessage[];
  stream: false;
  options: {
    temperature: number;
  };
}

interface OllamaChatResponse {
  message?: {
    role?: string;
    content?: string;
  };
}

@Injectable()
export class OllamaService {
  constructor(private readonly configService: ConfigService) {}

  async chat(messages: AiAgentMessage[]) {
    const baseUrl = this.configService.get<string>(
      'OLLAMA_BASE_URL',
      'http://localhost:11434',
    );
    const model = this.configService.get<string>(
      'AI_AGENT_MODEL',
      'qwen2.5:7b',
    );
    const temperature = Number(
      this.configService.get<string>('AI_AGENT_TEMPERATURE', '0.2'),
    );

    const payload: OllamaChatRequest = {
      model,
      messages,
      stream: false,
      options: {
        temperature: Number.isFinite(temperature) ? temperature : 0.2,
      },
    };

    let response: Response;

    try {
      response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new ServiceUnavailableException(
        'Ollama is unavailable. Please make sure the local Ollama service is running.',
      );
    }

    if (!response.ok) {
      throw new BadGatewayException(
        `Ollama returned an error status: ${response.status}.`,
      );
    }

    let data: OllamaChatResponse;

    try {
      data = (await response.json()) as OllamaChatResponse;
    } catch {
      throw new InternalServerErrorException(
        'Received an invalid response from Ollama.',
      );
    }

    const content = data.message?.content?.trim();

    if (!content) {
      throw new InternalServerErrorException(
        'Ollama returned an empty response.',
      );
    }

    return {
      content,
      model,
      provider: 'ollama',
    };
  }
}
