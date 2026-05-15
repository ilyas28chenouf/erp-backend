import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { MEC_AGENT_SYSTEM_PROMPT } from './prompts/mec-agent-system.prompt';

export interface AiAgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiAgentContextService {
  buildMessages(user: UserOrmEntity, userMessage: string): AiAgentMessage[] {
    const language = this.detectPreferredLanguage(user, userMessage);

    return [
      {
        role: 'system',
        content: [
          MEC_AGENT_SYSTEM_PROMPT,
          '',
          'Current user context:',
          `- User ID: ${user.id}`,
          `- Full name: ${user.fullName}`,
          `- Email: ${user.email}`,
          `- Role: ${user.role}`,
          `- Preferred language: ${language}`,
          '',
          'Response guidance:',
          '- Greet the user naturally when helpful.',
          '- If the user asks for exact ERP totals or records, clearly explain that ERP data tools are not connected yet.',
          '- Offer the next best helpful answer without pretending live data was loaded.',
        ].join('\n'),
      },
      {
        role: 'user',
        content: userMessage,
      },
    ];
  }

  private detectPreferredLanguage(user: UserOrmEntity, userMessage: string) {
    const profileLanguage = (user as UserOrmEntity & { language?: string | null })
      .language;

    if (profileLanguage?.trim()) {
      return profileLanguage.trim();
    }

    return /[А-Яа-яЁё]/.test(userMessage) ? 'ru' : 'en';
  }
}
