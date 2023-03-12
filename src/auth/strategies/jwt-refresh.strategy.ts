import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.refreshToken.secret'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<User | boolean> {
    const refreshToken = request.headers['authorization'].split(' ')[1];
    const isTokenValid = await this.authService.validateRefreshToken(
      refreshToken,
      payload.sub,
    );

    return isTokenValid;
  }
}
