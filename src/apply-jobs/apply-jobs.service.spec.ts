import { Test, TestingModule } from '@nestjs/testing';
import { ApplyJobsService } from './apply-jobs.service';

describe('ApplyJobsService', () => {
  let service: ApplyJobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplyJobsService],
    }).compile();

    service = module.get<ApplyJobsService>(ApplyJobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
