import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UsersModel } from 'src/users/entities/users.entity';
<<<<<<< HEAD
import { CreateCourseDto } from './dto/create-course.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
=======
>>>>>>> 0a0c982 (asdf)

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getCourse() {
    return this.coursesService.getCourses();
  }

  @Post()
<<<<<<< HEAD
  @UseGuards(AccessTokenGuard)
  postCourse(@Body() user: UsersModel, @Body() body: CreateCourseDto) {
=======
  postCourse(
    @Body('author') author: UsersModel,
    @Body('class_name') class_name: string,
    @Body('content') content: string,
    @Body('subject') subject: string,
    @Body('class_code') class_code: string
  ) {
>>>>>>> 0a0c982 (asdf)
    console.log('coutse post');
    return this.coursesService.createCourse(user.id, body);
  }
}
