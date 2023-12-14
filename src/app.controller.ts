import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome() {
    return 'Hello World';
  }
  @Get('post')
  getPost() {
    return 'Post Page';
  }
  @Get('user')
  getUser() {
    return 'User';
  }
}
