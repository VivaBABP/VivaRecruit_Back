import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateJobDTO from './dto/create-jobs.dto';
import UpdateJobDTO from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(createJob: CreateJobDTO): Promise<void> {
    await this.prisma.jobDescription.create({
      data: {
        jobName: createJob.jobName,
        jobDescription: createJob.jobDescription,
        skills: createJob.skillsNeeded,
        accountId: 1,
      },
    });
  }

  // async updateJob(updateJob: UpdateJobDTO): Promise<any> {
  //   await this.prisma.jobDescription.update({
  //     where: {
  //       id: updateJob.jobId,
  //     },
  //     data: {
  //       jobName: updateJob.jobName,
  //       jobDescription: updateJob.jobDescription,
  //       skills: updateJob.skillsNeeded,
  //       accountId: 1,
  //     },
  //   });
  // }
}
