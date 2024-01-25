import { IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CoursesModel extends BaseModel {
  @ManyToOne(() => UsersModel, user => user.courses, {
    nullable: false
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'message'
  })
  subject: string;

  @Column()
  @IsString({
    message: 'code'
  })
  @Length(3)
  class_code: string;

  @Column()
  content: string;

  @Column()
  like_count: number;

  @Column()
  comment_count: number;
}
