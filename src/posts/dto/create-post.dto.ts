import { IsString } from 'class-validator';
import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';

// Pick, Omit, Partial => Type을 반환
// PickType, OmitType, PartialType => 값을 반환

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  // @IsString({
  //   message: 'Titile should be string type.'
  // })
  // title: string;
  // @IsString({
  //   message: 'content should be string type.'
  // })
  // content: string;
}
