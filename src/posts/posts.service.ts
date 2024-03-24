import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CategoryEnum } from './const/category.const';
import { TypesEnum } from './const/type.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>
  ) {}

  async getAllPosts() {
    const res = await this.postsRepository.find({
      where: [
        {
          type: TypesEnum.COMMON
        }
      ],
      // relations: {
      //   author: true
      // },
      relations: ['author', 'comments'],
      order: {
        id: 'DESC'
        // type: 'ASC'
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
    // console.log(res);
    return res;
  }
  async getSpecialPosts() {
    return await this.postsRepository.find({
      where: [
        {
          type: TypesEnum.ANN
        },
        {
          type: TypesEnum.POPULAR
        }
      ],
      // relations: {
      //   author: true,
      //   comments: true
      // },
      relations: ['author', 'comments'],
      order: {
        // id: 'DESC'
        type: 'ASC'
      }
    });
  }
  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id
      },
      relations: ['author', 'comments'],
      select: {
        author: {
          id: true,
          nickname: true,
          email: true,
          country: true,
          role: true,
          countryUrl: true
        },
        comments: {
          id: true
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

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `Random Post ${i}`,
        content: `Random content ${i}`,
        category: CategoryEnum.ETC
      });
    }
  }

  async updatePost(userId: number, postId: number, postDto: UpdatePostDto) {
    const { title, content, category } = postDto;
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
    if (category) {
      post.category = category;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }
  async updateType(role: string, postDto: UpdatePostDto, id: number) {
    const { type } = postDto;
    if (role === 'ADMIN') {
      const post = await this.postsRepository.findOne({
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

      post.type = type;

      const newPost = await this.postsRepository.save(post);
      return newPost;
    } else {
      throw new UnauthorizedException('You are not admin user.');
    }
  }

  async incrementViews(postId: number) {
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

  async deletePost(userId: number, role: string, postId: number) {
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

    if (role !== 'ADMIN' && userId !== post.author.id) {
      throw new UnauthorizedException("Cannot delete other's post");
    }
    await this.postsRepository.delete(postId);

    return postId;
  }
  async editCommentsCount(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id
      },
      relations: {
        author: true,
        comments: true
      }
    });
    // console.log(post);
    // console.log(post.comments.length);
    post.commentCount = post.comments.length;
    const updated = await this.postsRepository.save(post);
    return updated;
  }
}
