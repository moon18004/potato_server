import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password' | 'country'>) {
    const nicknameExists = await this.userRepository.exist({
      where: { nickname: user.nickname }
    });
    if (nicknameExists) {
      throw new BadRequestException('Nickname already exists.');
    }
    const emailExists = await this.userRepository.exist({
      where: { email: user.email }
    });
    if (emailExists) {
      throw new BadRequestException('Email already exists.');
    }

    const userObject = this.userRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
      country: user.country
    });

    const newUser = await this.userRepository.save(userObject);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email
      }
    });
  }
}
