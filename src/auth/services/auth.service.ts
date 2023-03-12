import { compare, hash } from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const authPassword = await compare(password, user.password);
    if (!authPassword) {
      throw new UnauthorizedException();
    }

    delete user.password;
    return user;
  }

  async validateRefreshToken(
    refreshToken: string,
    id: string,
  ): Promise<User | boolean> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user?.refreshToken) {
      return false;
    }

    return compare(refreshToken, user.refreshToken);
  }

  async refreshTokens(req: Partial<User>) {
    const user = await this.usersRepository.findOneBy({ id: req.id });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const tokens = await this.getJwtTokens(user);
    return tokens;
  }

  async login(user: Partial<User>) {
    return this.getJwtTokens(user);
  }

  async logout(userId: string) {
    return this.usersRepository.update(userId, { refreshToken: null });
  }

  private async getJwtTokens(user: Partial<User>) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.generateAccessToken(payload);
    const { refreshToken, hashedToken } = await this.generateRefreshToken(
      payload,
    );

    await this.usersRepository.update(user.id, {
      refreshToken: hashedToken,
    });
    return { accessToken, refreshToken };
  }

  private generateAccessToken(payload: { sub: string; email: string }) {
    return this.jwtService.signAsync(
      payload,
      this.configService.get<Partial<JwtSignOptions>>('auth.accessToken'),
    );
  }

  private async generateRefreshToken(payload: { sub: string; email: string }) {
    const refreshToken = await this.jwtService.signAsync(
      payload,
      this.configService.get<Partial<JwtSignOptions>>('auth.refreshToken'),
    );
    const hashedToken = await hash(refreshToken, 10);
    return { refreshToken, hashedToken };
  }
}
