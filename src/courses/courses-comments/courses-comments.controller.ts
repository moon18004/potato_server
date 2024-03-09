import { Controller } from '@nestjs/common';
import { CoursesCommentsService } from './courses-comments.service';

@Controller('courses-comments')
export class CoursesCommentsController {
  constructor(private readonly coursesCommentsService: CoursesCommentsService) {}
}
