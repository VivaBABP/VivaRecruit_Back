import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import UpdateJobDTO from './dto/update-job.dto';
import CreateJobDTO from './dto/create-jobs.dto';
import GetJobsDTO from './dto/get-jobs.dto';
import { job } from 'cron';

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

  async updateJob(updateJob: UpdateJobDTO, idAccount: number): Promise<void> {
    const jobExists = await this.prisma.jobDescription.findFirst({
      where: {
        id: updateJob.jobId,
        accountId: idAccount,
      },
    });
    if (!jobExists)
      throw new BadRequestException(
        "Ce job n'existe pas ou vous n'êtes pas autorisé à le modifier",
      );
    await this.prisma.jobDescription.update({
      where: {
        id: updateJob.jobId,
      },
      data: {
        jobName: updateJob.jobName,
        jobDescription: updateJob.jobDescription,
        skills: updateJob.skillsNeeded,
      },
    });
  }

  async getJob(idJob: number): Promise<UpdateJobDTO> {
    console.log(idJob);
    await this.verifyIfJobExist(idJob);
    const job = await this.prisma.jobDescription.findFirst({
      where: {
        id: idJob,
      },
    });
    return {
      jobId: job.id,
      jobDescription: job.jobDescription,
      jobName: job.jobName,
      skillsNeeded: job.skills,
    };
  }

  async getJobs(id: number): Promise<GetJobsDTO[]> {
    const appliedJobs = await this.getAppliedJob(id);
    const jobs = await this.prisma.jobDescription.findMany({
      select: {
        id: true,
        skills: true,
        jobDescription: true,
        jobName: true,
        account: {
          select: {
            email: true,
          },
        },
      },
    });
    const listJobs: GetJobsDTO[] = [];
    if (!appliedJobs) {
      jobs.forEach((e) => {
        listJobs.push({
          jobId: e.id,
          jobName: e.jobName,
          jobDescription: e.jobDescription,
          skillsNeeded: e.skills,
          applied: false,
          email: e.account.email,
        });
      });
    } else {
      jobs.forEach((e) => {
        const applied = appliedJobs.find((a) => a.jobId == e.id);
        listJobs.push({
          jobId: e.id,
          jobName: e.jobName,
          jobDescription: e.jobDescription,
          skillsNeeded: e.skills,
          applied: applied != undefined,
          email: e.account.email,
        });
      });
    }
    return listJobs;
  }

  private async verifyIfJobExist(idJob: number) {
    const jobExist = await this.prisma.jobDescription.findFirst({
      where: {
        id: idJob,
      },
    });
    if (!jobExist)
      throw new BadRequestException("Le job séléctionné n'existe pas.");
  }
}
