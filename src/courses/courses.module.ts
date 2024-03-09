import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModel } from './entities/courses.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CoursesCommentsModule } from './courses-comments/courses-comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([CoursesModel]), AuthModule, UsersModule, CoursesCommentsModule],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
