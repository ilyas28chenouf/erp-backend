import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentContextService } from './ai-agent-context.service';
import { AiAgentService } from './ai-agent.service';
import { OllamaService } from './ollama.service';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AiAgentController],
  providers: [AiAgentService, AiAgentContextService, OllamaService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
