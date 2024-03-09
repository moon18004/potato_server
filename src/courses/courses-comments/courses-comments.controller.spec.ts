import { Test, TestingModule } from '@nestjs/testing';
import { CoursesCommentsController } from './courses-comments.controller';
import { CoursesCommentsService } from './courses-comments.service';

describe('CoursesCommentsController', () => {
  let controller: CoursesCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesCommentsController],
      providers: [CoursesCommentsService],
    }).compile();

    controller = module.get<CoursesCommentsController>(CoursesCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
