import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getCourse() {
    return this.coursesService.getCourses();
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postCourse(@Body() user: UsersModel, @Body() body: CreateCourseDto) {
    console.log('coutse post');
    return this.coursesService.createCourse(user.id, body);
  }
}
