import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { HASH_ROUNDS } from '../auth/const/auth.const';
import * as bcrypt from 'bcrypt';

import { EditUserDto } from 'src/auth/dto/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async checkUser(email: string) {
    const user = await this.userRepository.exists({
      where: { email }
    });
    // console.log(user);
    return user;
  }

  async createUser(
    user: Pick<
      UsersModel,
      'email' | 'nickname' | 'password' | 'country' | 'countryUrl' | 'fullName'
    >
  ) {
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
      country: user.country,
      countryUrl: user.countryUrl,
      fullName: user.fullName
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

  async updateUser(email: string, userDto: EditUserDto) {
    const { nickname, fullName, password, country, currentPwd, countryUrl } = userDto;
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });
    // console.log(password);
    // console.log(user.password);
    // console.log()

    if (!user) {
      throw new NotFoundException();
    }

    if (nickname) {
      user.nickname = nickname;
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (country) {
      user.country = country;
    }
    if (countryUrl) {
      user.countryUrl = countryUrl;
    }

    if (password) {
      const passOk = await bcrypt.compare(currentPwd, user.password);
      if (passOk) {
        const hash = await bcrypt.hash(password, HASH_ROUNDS);
        // console.log(hash);
        user.password = hash;
      } else {
        throw new UnauthorizedException('Current password is not correct.');
      }
    }

    const newUser = await this.userRepository.save(user);
    // console.log(newUser);
    return newUser;
  }

  async changePwd(email, body) {
    const { password } = body;
    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });
    if (password) {
      const hash = await bcrypt.hash(password, HASH_ROUNDS);
      user.password = hash;
    }
    const newUser = await this.userRepository.save(user);
    return newUser;
  }
}
