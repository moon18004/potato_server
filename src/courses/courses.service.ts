import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoursesModel } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursesModel)
    private readonly coursesRepository: Repository<CoursesModel>
  ) {}
  async getCourses() {
    return await this.coursesRepository.find({
      relations: {
        author: true
      },
    });
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

  async updateCourse(userId: number, courseId: number, courseDto: UpdateCourseDto) {
    const { class_code, subject, base_content, add_content } = courseDto;
    const course = await this.coursesRepository.findOne({
      where: {
        id: courseId
      },
      relations: {
        author: true
      },
      select: {
        author: {
          id: true
        }
      }
    });
    if (!course) {
      throw new NotFoundException();
    }
    if (userId !== course.author.id) {
      throw new UnauthorizedException(`Cannot update the course`);
    }
    if (class_code) {
      course.class_code = class_code;
    }
    if (subject) {
      course.subject = subject;
    }
    if (base_content) {
      course.base_content = base_content;
    }
    if (add_content) {
      course.add_content = add_content;
    }

    const newCourse = await this.coursesRepository.save(course);

    return newCourse;
  }

  async deleteCourse(userId: number, courseId: number) {
    const course = await this.coursesRepository.findOne({
      where: {
        id: courseId
      },
      relations: {
        author: true
      }
    });
    if (!course) {
      throw new NotFoundException();
    }
    // console.log(post);
    if (userId !== course.author.id) {
      throw new UnauthorizedException("Cannot delete other's post");
    }
    await this.coursesRepository.delete(courseId);

    return courseId;
  }
}
