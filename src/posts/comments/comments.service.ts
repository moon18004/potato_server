import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsCommentsModel } from './entities/postComments.entity';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from './dto/create-postComment.dto';
import { PostsService } from '../posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(PostsCommentsModel)
    private readonly commentsRepository: Repository<PostsCommentsModel>,
    private readonly postsService: PostsService
  ) {}

  async getCommentByPostId(postId: number) {
    const comment = await this.commentsRepository.find({
      where: {
        post: {
          id: postId
        }
      },
      relations: {
        author: true
      },
      select: {
        author: {
          id: true,
          nickname: true,
          countryUrl: true,
          email: true
        }
      },
      order: {
        id: 'ASC'
      }
    });
    if (!comment) {
      return [];
      // throw new NotFoundException()
    }
    return comment;
  }

  async createComment(authorId: number, postId: number, commentDto: CreatePostCommentDto) {
    const comment = this.commentsRepository.create({
      author: {
        id: authorId
      },
      post: {
        id: postId
      },
      ...commentDto,
      likeCount: 0
    });
    const newComment = await this.commentsRepository.save(comment);
    const newPost = await this.postsService.editCommentsCount(postId);
    
    return newComment;
  }

  async deleteComment(userId: number, id: number, postId:number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id
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
    if (!comment) {
      throw new NotFoundException();
    }
    if (userId !== comment.author.id) {
      throw new UnauthorizedException("Cannot delete other's comment");
    }

    await this.commentsRepository.delete(id);
    const newPost = await this.postsService.editCommentsCount(postId);
    return id;
  }
  async updateComment(userId: number, commentDto: CreatePostCommentDto, commentId: number) {
    const { content } = commentDto;
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId
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
    if (!comment) {
      throw new NotFoundException();
    }
    if (userId !== comment.author.id) {
      throw new UnauthorizedException("Cannot update other's comment");
    }
    if (content) {
      comment.content = content;
    }
    const updatedComment = await this.commentsRepository.save(comment);
    return updatedComment;
  }
}
