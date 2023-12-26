import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async createUser(nickname: string, email: string, password: string, country: string) {
    const user = this.userRepository.create({
      nickname,
      email,
      password,
      country
    });

    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}
