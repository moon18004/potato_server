import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UsersModel } from 'src/users/entities/users.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from 'src/users/decorator/user.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getCourse() {
    return this.coursesService.getCourses();
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postCourse(@User() user: UsersModel, @Body() body: CreateCourseDto) {
    return this.coursesService.createCourse(user.id, body);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchCourse(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UsersModel,
    @Body() body: UpdateCourseDto
  ) {
    console.log('patch');
    return this.coursesService.updateCourse(user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteCourse(@Param('id', ParseIntPipe) id: number, @User() user: UsersModel) {
    return this.coursesService.deleteCourse(user.id, id);
  }
}
