import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import CreateJobDTO from './dto/create-jobs.dto';
// import UpdateJobDTO from './dto/update-job.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() createJob: CreateJobDTO): Promise<string> {
    await this.jobsService.createJob(createJob);
    return '';
  }

  // @Patch(':id')
  // async updateJob(@Body() updateJob: UpdateJobDTO): Promise<string> {
  //   // return await this.jobsService.createJob(createJob);
  //   return 'Ok';
  // }
}
