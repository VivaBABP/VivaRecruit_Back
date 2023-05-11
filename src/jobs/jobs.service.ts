import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateJobDTO from './dto/create-jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(createJob: CreateJobDTO, id: number): Promise<void> {
    await this.prisma.jobDescription.create({
      data: {
        jobName: createJob.jobName,
        jobDescription: createJob.jobDescription,
        skills: createJob.skillsNeeded,
        accountId: id,
      },
    });
  }

  //A finir quand on pourra récupérer le Token
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
