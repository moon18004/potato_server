import { PickType } from '@nestjs/mapped-types';
import { PostsCommentsModel } from '../entities/postComments.entity';

export class CreatePostCommentDto extends PickType(PostsCommentsModel, ['content']){
	
}