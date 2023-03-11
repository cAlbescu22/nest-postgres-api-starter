import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
  },
}));
