import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActionLogsModule } from '../action-logs/action-logs.module';
import { AuthModule } from '../auth/auth.module';
import { DocumentsModule } from '../documents/documents.module';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentContextService } from './ai-agent-context.service';
import { AiAgentDocumentContextService } from './ai-agent-document-context.service';
import { AiAgentService } from './ai-agent.service';
import { OllamaService } from './ollama.service';

@Module({
  imports: [ConfigModule, ActionLogsModule, AuthModule, DocumentsModule],
  controllers: [AiAgentController],
  providers: [
    AiAgentService,
    AiAgentContextService,
    AiAgentDocumentContextService,
    OllamaService,
  ],
  exports: [AiAgentService],
})
export class AiAgentModule {}
