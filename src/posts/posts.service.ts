import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>
  ) {}

  async getAllPosts() {
    return await this.postsRepository.find({
      relations: {
        author: true
      },
      order: {
        id: 'DESC'
      }
      // select: {
      //   author: {
      //     id: true,
      //     nickname: true,
      //     email: true,
      //     country: true,
      //     role: true
      //   }
      // }
    });
  }
  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id
      },
      relations: {
        author: true
      },
      select: {
        author: {
          id: true,
          nickname: true,
          email: true,
          country: true,
          role: true,
          countryUrl: true
        }
      }
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
      viewCount: 0
    });
    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(userId: number, postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
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
    if (!post) {
      throw new NotFoundException();
    }
    if (userId !== post.author.id) {
      throw new UnauthorizedException("Cannot update other's post");
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async incrementViews(postId) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });
    post.viewCount += 1;
    const updated = await this.postsRepository.save(post);
    return updated;
  }
  async incrementLikes(postId) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });
    post.likeCount += 1;
    const updated = await this.postsRepository.save(post);
    return updated;
  }
  async decrementLikes(postId) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });
    post.likeCount -= 1;
    const updated = await this.postsRepository.save(post);
    return updated;
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      },
      relations: {
        author: true
      }
    });
    if (!post) {
      throw new NotFoundException();
    }
    // console.log(post);
    if (userId !== post.author.id) {
      throw new UnauthorizedException("Cannot delete other's post");
    }
    await this.postsRepository.delete(postId);

    return postId;
  }
}
