import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/presentation/guards/roles.guard';
import { UserOrmEntity } from '../users/infrastructure/persistence/user.orm-entity';
import { AiAgentService } from './ai-agent.service';
import { AiAgentChatDto } from './dto/ai-agent-chat.dto';
import { AiAgentChatResponseDto } from './dto/ai-agent-chat-response.dto';

@ApiTags('AI Agent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('chat')
  @ApiOperation({
    summary: 'Chat with MEC AI Agent',
    description:
      'Sends a user message to the backend AI agent, which uses local Ollama and ERP context.',
  })
  @ApiResponse({
    status: 201,
    description: 'AI agent response returned.',
    type: AiAgentChatResponseDto,
  })
  createChat(
    @Body() dto: AiAgentChatDto,
    @Req() req: Request & { user: UserOrmEntity },
  ) {
    return this.aiAgentService.chat(dto, req.user);
  }
}
