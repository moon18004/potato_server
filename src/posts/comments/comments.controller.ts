import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreatePostCommentDto } from './dto/create-postComment.dto';

@Controller('postsComments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  @UseGuards(AccessTokenGuard)
  postComment(
    @User() user: UsersModel,
    @Body() body: CreatePostCommentDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.commentsService.createComment(user.id, id, body);
  }
  @Get(':postId')
  getCommentByPost(@Param('postId', ParseIntPipe) id: number) {
    return this.commentsService.getCommentByPostId(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchComment(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UsersModel,
    @Body() body: CreatePostCommentDto
  ) {
    return this.commentsService.updateComment(user.id, body, id);
  }
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() post: string,
    @User() user: UsersModel
  ) {
    // const { postId } = post;
    console.log(post['postId']);
    const postId = post['postId'];
    return this.commentsService.deleteComment(user.id, id, postId);
  }
}
