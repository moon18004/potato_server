import { IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsCommentsModel extends BaseModel {
  @Column()
  likeCount: number;

  @Column()
  @IsString({
    message: 'content should be string type.'
  })
  @Length(4)
  content: string;

  @ManyToOne(() => UsersModel, user => user.postsComments, {
    nullable: false
  })
  author: UsersModel;

	@ManyToOne(() => PostsModel, post => post.comments, {
    nullable: false
  })
  post: PostsModel;
}
