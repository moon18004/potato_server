import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  class_code?: string;

  @IsArray()
  @IsOptional()
  base_content?: string[];

  @IsArray()
  @IsOptional()
  add_content?: string[];
}
