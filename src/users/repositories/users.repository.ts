import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import CreateUsersDto from '../dto/create-users.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {
    repository;
  }

  public async list(): Promise<User[]> {
    return this.repository.find();
  }

  public async create(dto: CreateUsersDto): Promise<User> {
    return this.repository.save(dto);
  }

  public async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }
}
