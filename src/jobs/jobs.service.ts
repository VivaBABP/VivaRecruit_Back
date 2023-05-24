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
    const jobs = await this.prisma.jobDescription.findMany();
    const listJobs: GetJobsDTO[] = [];
    if (!appliedJobs) {
      jobs.forEach((e) => {
        listJobs.push({
          jobId: e.id,
          jobName: e.jobName,
          jobDescription: e.jobDescription,
          skillsNeeded: e.skills,
          applied: false,
        });
      });
    } else {
      jobs.forEach((e) => {
        const applied = appliedJobs.find((a) => a.jobId == e.id);
        console.log(applied);
        listJobs.push({
          jobId: e.id,
          jobName: e.jobName,
          jobDescription: e.jobDescription,
          skillsNeeded: e.skills,
          applied: applied != undefined,
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

  async applyJob(idJob: number, idAccount: number) {
    await this.verifyIfJobExist(idJob);
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

  async getAppliedJob(idAccount: number): Promise<UpdateJobDTO[]> {
    const query = await this.prisma.applyJob.findMany({
      where: {
        idAccount: { id: idAccount },
      },
      select: {
        idJob: {
          select: {
            jobName: true,
            jobDescription: true,
            skills: true,
            id: true,
          },
        },
      },
    });
    const listeJobs: UpdateJobDTO[] = [];
    query.forEach((e) => {
      const job: UpdateJobDTO = {
        jobId: e.idJob.id,
        jobName: e.idJob.jobName,
        jobDescription: e.idJob.jobDescription,
        skillsNeeded: e.idJob.skills,
      };
      listeJobs.push(job);
    });
    return listeJobs;
  }
  async deleteAppliedJob(idAccount: number, idJob: number): Promise<void> {
    await this.verifyIfJobExist(idJob);
    await this.prisma.applyJob.deleteMany({
      where: {
        idAccount: { id: idAccount },
        idJob: { id: idJob },
      },
    });
  }
}
