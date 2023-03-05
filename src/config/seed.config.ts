import { registerAs } from '@nestjs/config';

export default registerAs('seed', () => ({
  active: process.env.RUN_SEED ? process.env.RUN_SEED === 'yes' : true,
}));
