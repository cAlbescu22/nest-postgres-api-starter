import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  public list(): Promise<User[]> {
    return this.usersRepository.list();
  }
}
