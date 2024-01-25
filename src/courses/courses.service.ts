import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesModel } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursesModel)
    private readonly coursesRepository: Repository<CoursesModel>
  ) {}
  async getCourses() {
    return await this.coursesRepository.find();
  }
  async createCourse(author_id: number, courseDto: CreateCourseDto) {
    const course = this.coursesRepository.create({
      author: {
        id: author_id
      },
      ...courseDto,
      like_count: 0,
      comment_count: 0
    });
    const newCourse = await this.coursesRepository.save(course);
    return newCourse;
  }
}
