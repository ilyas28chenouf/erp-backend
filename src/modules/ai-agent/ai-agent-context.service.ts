import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { AiAgentHistoryMessageDto } from './dto/ai-agent-chat.dto';
import { MEC_AGENT_SYSTEM_PROMPT } from './prompts/mec-agent-system.prompt';

export interface AiAgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiAgentContextService {
  buildMessages(params: {
    user: UserOrmEntity;
    userMessage: string;
    history?: AiAgentHistoryMessageDto[];
    documentContext?: string | null;
  }): AiAgentMessage[] {
    const { user, userMessage, history, documentContext } = params;
    const language = this.detectPreferredLanguage(user, userMessage);
    const normalizedHistory = (history ?? [])
      .filter(
        (message): message is AiAgentHistoryMessageDto =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0,
      )
      .slice(-12)
      .map<AiAgentMessage>((message) => ({
        role: message.role,
        content: message.content.trim(),
      }));

    const systemContent = [
      MEC_AGENT_SYSTEM_PROMPT,
      '',
      'Current user context:',
      `- User ID: ${user.id}`,
      `- Full name: ${user.fullName}`,
      `- Email: ${user.email}`,
      `- Role: ${user.role}`,
      `- Preferred language: ${language}`,
      `- Conversation state: ${normalizedHistory.length > 0 ? 'ongoing' : 'new'}`,
      '',
      'Response guidance:',
      '- If the user asks for exact ERP totals or records, clearly explain that ERP data tools are not connected yet.',
      '- Offer the next best helpful answer without pretending live data was loaded.',
    ];

    if (documentContext) {
      systemContent.push(
        '',
        'Selected ERP document text:',
        documentContext,
        '',
        'Document extraction instructions:',
        '- Extract only from the provided document text.',
        '- If a field is missing, say it is missing.',
        '- Do not invent contract numbers, dates, or amounts.',
      );
    }

    return [
      {
        role: 'system',
        content: systemContent.join('\n'),
      },
      ...normalizedHistory,
      {
        role: 'user',
        content: userMessage,
      },
    ];
  }

  detectPreferredLanguage(user: UserOrmEntity, userMessage: string) {
    const profileLanguage = (user as UserOrmEntity & { language?: string | null })
      .language;

    if (profileLanguage?.trim()) {
      return profileLanguage.trim();
    }

    return /[А-Яа-яЁё]/.test(userMessage) ? 'ru' : 'en';
  }
}
