import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesModel } from './entities/courses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursesModel)
    private readonly coursesRepository: Repository<CoursesModel>
  ) {}
  async getCourses() {
    return await this.coursesRepository.find();
  }
  async createCourse(
    author: string,
    class_name: string,
    content: string,
    subject: string,
    class_code: string
  ) {
    console.log(subject);
    const course = this.coursesRepository.create({
      author,
      content,
      subject,
      class_code,
      like_count: 0,
      comment_count: 0
    });
    const newCourse = await this.coursesRepository.save(course);
    return newCourse;
  }
}
