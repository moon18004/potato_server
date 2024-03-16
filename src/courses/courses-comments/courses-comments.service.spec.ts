import { Test, TestingModule } from '@nestjs/testing';
import { CoursesCommentsService } from './courses-comments.service';

describe('CoursesCommentsService', () => {
  let service: CoursesCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesCommentsService],
    }).compile();

    service = module.get<CoursesCommentsService>(CoursesCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
