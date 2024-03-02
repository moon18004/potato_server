import { PickType } from "@nestjs/mapped-types";
import { CoursesModel } from "../entities/courses.entity";

export class CreateCourseDto extends PickType(CoursesModel, [
  'class_code',
  'subject',
  'base_content',
  'add_content'
]) {}
