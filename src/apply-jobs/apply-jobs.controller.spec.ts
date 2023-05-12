import { Test, TestingModule } from '@nestjs/testing';
import { ApplyJobsController } from './apply-jobs.controller';

describe('ApplyJobsController', () => {
  let controller: ApplyJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyJobsController],
    }).compile();

    controller = module.get<ApplyJobsController>(ApplyJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
