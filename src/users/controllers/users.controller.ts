import { Controller, Get } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.list();
  }
}
