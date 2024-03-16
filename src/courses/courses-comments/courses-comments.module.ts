import { Module } from '@nestjs/common';
import { CoursesCommentsService } from './courses-comments.service';
import { CoursesCommentsController } from './courses-comments.controller';

@Module({
  controllers: [CoursesCommentsController],
  providers: [CoursesCommentsService],
})
export class CoursesCommentsModule {}
