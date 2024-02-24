import { PartialType, PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';
import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../const/category.const';
import { TypesEnum } from '../const/type.const';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  category?: CategoryEnum;

  @IsString()
  @IsOptional()
  type?: TypesEnum;
}
