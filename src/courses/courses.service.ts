import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesModel } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
<<<<<<< HEAD
import { CreateCourseDto } from './dto/create-course.dto';
=======
>>>>>>> 0a0c982 (asdf)

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursesModel)
    private readonly coursesRepository: Repository<CoursesModel>
  ) {}
  async getCourses() {
    return await this.coursesRepository.find();
  }
<<<<<<< HEAD
  async createCourse(author_id: number, courseDto: CreateCourseDto) {
=======
  async createCourse(
    author: UsersModel,
    class_name: string,
    content: string,
    subject: string,
    class_code: string
  ) {
    console.log(subject);
>>>>>>> 0a0c982 (asdf)
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
