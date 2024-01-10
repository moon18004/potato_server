import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getCourse() {
    return this.coursesService.getCourses();
  }

  @Post()
  postCourse(
    @Body('author') author: string,
    @Body('class_name') class_name: string,
    @Body('content') content: string,
    @Body('subject') subject: string,
    @Body('class_code') class_code: string
  ) {
    console.log('coutse post');
    return this.coursesService.createCourse(author, class_name, content, subject, class_code);
  }
}
