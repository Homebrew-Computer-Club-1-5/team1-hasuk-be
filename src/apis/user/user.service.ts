import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db_entity/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne({ user_auth_id, name, auth_method }) {
    const result = await this.userRepository.findOne({
      where: { user_auth_id, name, auth_method },
    });
    return result;
  }

  async create({ user_auth_id, name, auth_method }) {
    const result = await this.userRepository.save({
      user_auth_id,
      name,
      auth_method,
    });
    return result;
  }
}
