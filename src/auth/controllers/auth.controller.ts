import {
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginResponseDto } from '../dto/login-response.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() { user }: { user: Partial<User> },
  ): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Request() { user }: { user: Partial<User> },
    @Response() res,
  ): Promise<void> {
    await this.authService.logout(user.id);
    res.status(200).send();
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshTokens(
    @Request() { user }: { user: Partial<User> },
  ): Promise<LoginResponseDto> {
    return this.authService.refreshTokens(user);
  }
}
