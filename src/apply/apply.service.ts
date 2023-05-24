import { BadRequestException, Injectable } from '@nestjs/common';
import UpdateJobDTO from '../jobs/dto/update-job.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplyService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyIfJobExist(idJob: number) {
    const jobExist = await this.prisma.jobDescription.findFirst({
      where: {
        id: idJob,
      },
    });
    if (!jobExist)
      throw new BadRequestException("Le job séléctionné n'existe pas.");
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
