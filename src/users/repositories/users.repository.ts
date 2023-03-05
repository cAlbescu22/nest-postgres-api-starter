import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
    repository;
  }

  public async list(): Promise<User[]> {
    return this.repository.find();
  }
}
