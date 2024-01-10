import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel extends BaseModel {
  // @PrimaryGeneratedColumn()
  // id: number;

  @ManyToOne(() => UsersModel, user => user.posts, {
    nullable: false
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'Titile should be string type.'
  })
  title: string;

  @Column()
  @IsString({
    message: 'content should be string type.'
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
