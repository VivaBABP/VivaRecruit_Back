import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import CreateJobDTO from './dto/create-jobs.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() createJob: CreateJobDTO): Promise<void> {
    return await this.jobsService.createJob(createJob);
  }

  //A finir quand on pourra récupérer le Token
  // @Patch(':id')
  // async updateJob(@Body() updateJob: UpdateJobDTO): Promise<string> {
  //   // return await this.jobsService.createJob(createJob);
  //   return 'Ok';
  // }
}
