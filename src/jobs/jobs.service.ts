import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateJobDTO from './dto/create-jobs.dto';

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

  async applyJob(idJob: number, idAccount: number) {
    const jobApplied = await this.prisma.applyJob.findFirst({
      where: {
        idJob: { id: idJob },
        idAccount: { id: idAccount },
      },
    });
    if (jobApplied) {
      throw new BadRequestException('Vous avez déjà postulé pour ce poste');
    }
    await this.prisma.applyJob.create({
      data: {
        idJob: { connect: { id: idJob } },
        idAccount: { connect: { id: idAccount } },
      },
    });
  }
}
