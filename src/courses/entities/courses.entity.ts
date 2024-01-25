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
  subject: string;

  @Column()
  class_code: string;

  @Column()
  content: string;

  @Column()
  like_count: number;

  @Column()
  comment_count: number;
}
