import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CoursesModel extends BaseModel {
  @Column()
  subject: string;

  @Column()
  author: string;

  @Column()
  class_code: string;

  @Column()
  class_name: string;

  @Column()
  content: string;

  @Column()
  like_count: number;

  @Column()
  comment_count: number;
}
