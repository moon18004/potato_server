import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(){
    return this.usersService.getUsers();
  }

  @Post()
  postUser(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('country') country: string
  ) {
    return this.usersService.createUser(nickname, email, password, country);
  }
}
