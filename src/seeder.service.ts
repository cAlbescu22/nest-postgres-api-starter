import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';

import { UsersRepository } from './users/repositories/users.repository';
import { User } from './users/entities/user.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {}

  async run() {
    if (this.configService.get('seed.active')) {
      await Promise.all([this.systemAccount()]);
      this.logger.log('Seeding finished;');
      return;
    }
    this.logger.log('Seeding not active;');
  }

  async systemAccount() {
    const user: User = await this.usersRepository.findByEmail(
      process.env.SYSTEM_EMAIL,
    );
    if (user) {
      this.logger.verbose('System account already exists');
      return;
    }

    const properties = {
      email: process.env.SYSTEM_EMAIL,
      password: await hash(process.env.SYSTEM_PASSWORD, 10),
      firstName: 'System',
      lastName: 'Account',
    };

    await this.usersRepository.create(properties);

    this.logger.debug('Seeding finished for: system account');
  }
}
