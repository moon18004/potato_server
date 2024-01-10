import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UsersModel } from 'src/users/entities/users.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(
    @User() user: UsersModel,
    @Body() body: CreatePostDto
    // @Body('title') title: string,
    // @Body('content') content: string
  ) {
    return this.postsService.createPost(user.id, body);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UsersModel,
    @Body() body: UpdatePostDto
  ) {
    return this.postsService.updatePost(user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
