import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { IsEmail, IsString, Length, ValidationArguments } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { CoursesModel } from 'src/courses/entities/courses.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 24,
    unique: true
  })
  @IsString({ message: stringValidationMessage })
  @Length(4, 24, {
    message: lengthValidationMessage
  })
  nickname: string;

  @Column({
    unique: true
  })
  @IsString()
  @IsEmail(
    {},
    {
      message: emailValidationMessage
    }
  )
  email: string;

  @Column()
  @IsString()
  @Length(8, 16)
  /*
   * Request
   * frontend => backend: plain obejct (JSON) => class instance(dto)
   * toClassOnly => class instance로 변화 될 떄
   *
   * Response
   * backend => frontend: class instance(dto) => plain object(JSON)
   * toPlainOnly => plain object로 변환 될 때
   */
  // @Exclude({
  //   toPlainOnly: true
  // })
  password: string;

  @Column()
  @IsString()
  country: string;

  @Column()
  @IsString()
  countryUrl: string;

  @Column()
  @IsString()
  fullName: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER
  })
  role: RolesEnum;

  @OneToMany(() => CoursesModel, course => course.author)
  @JoinColumn({ name: 'author' })
  courses: CoursesModel[];

  @OneToMany(() => PostsModel, post => post.author)
  @JoinColumn({ name: 'author' })
  posts: PostsModel[];

}
