import { IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypesEnum } from '../const/type.const';
import { CategoryEnum } from '../const/category.const';
import { OneToMany } from 'typeorm';
import { PostsCommentsModel } from '../comments/entities/postComments.entity';

@Entity()
export class PostsModel extends BaseModel {
  // @PrimaryGeneratedColumn()
  // id: number;

  @ManyToOne(() => UsersModel, user => user.posts, {
    nullable: false
  })
  author: UsersModel;

  @OneToMany(() => PostsCommentsModel, comments => comments.post)
  comments: PostsCommentsModel[];

  @Column()
  @IsString({
    message: 'Titile should be string type.'
  })
  @Length(4)
  title: string;

  @Column()
  @IsString({
    message: 'content should be string type.'
  })
  @Length(4)
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;

  @Column()
  viewCount: number;

  @Column({
    enum: Object.values(CategoryEnum),
    default: CategoryEnum.ETC
  })
  category: CategoryEnum;

  @Column({
    enum: Object.values(TypesEnum),
    default: TypesEnum.COMMON
  })
  type: TypesEnum;
}
