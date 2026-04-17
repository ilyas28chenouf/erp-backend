import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { Public } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful.',
    type: AuthResponseDto,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Return current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user returned.' })
  me(@Req() req: Request & { user: { id: string } }) {
    return this.authService.me(req.user.id);
  }
}
