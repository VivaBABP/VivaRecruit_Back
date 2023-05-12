import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplyJobsService {
  constructor(private readonly prisma: PrismaService) {}

  async applyJob(idJob: number, idAccount: number) {
    const jobApplied = await this.prisma.applyJob.findFirst({
      where: {
        idJob: { id: idJob },
        idAccount: { id: idAccount },
      },
    });
    if (jobApplied) {
      throw new ForbiddenException('Vous avez déjà postulé pour ce poste');
    }
    await this.prisma.applyJob.create({
      data: {
        idJob: { connect: { id: idJob } },
        idAccount: { connect: { id: idAccount } },
      },
    });
  }
}
