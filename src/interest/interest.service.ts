import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetInterestDto } from './dto/get-interest.dto';

@Injectable()
export class InterestService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyIfInterestExists(id: number): Promise<void> {
    const interest = await this.prisma.interests.findFirst({
      where: {
        id: id,
      },
    });
    if (!interest)
      throw new BadRequestException("L'intérêt séléctionné n'existe pas");
  }

  async findAll(): Promise<GetInterestDto[]> {
    const interests = await this.prisma.interests.findMany({
      where: {},
    });
    const interestList: GetInterestDto[] = [];
    interests.forEach((e) => {
      interestList.push({ idInterest: e.id, labelInterest: e.labelInterest });
    });
    return interestList;
  }

  async findOne(id: number): Promise<GetInterestDto> {
    await this.verifyIfInterestExists(id);
    const interest = await this.prisma.interests.findFirst({
      where: {
        id: id,
      },
    });
    return { idInterest: interest.id, labelInterest: interest.labelInterest };
  }

  async addInterestToAccount(id: number, interest: number): Promise<void> {
    await this.verifyIfInterestExists(interest);
    const interestQuery = await this.prisma.hasInterest.findFirst({
      where: {
        accountId: id,
        interestsId: interest,
      },
    });
    console.log();
    if (interestQuery)
      throw new BadRequestException('Cet intérêt est déjà lié au Compte');
    await this.prisma.hasInterest.create({
      data: {
        accountId: id,
        interestsId: interest,
      },
    });
  }

  async removeInterestOfAccount(id: number, interest: number): Promise<void> {
    await this.verifyIfInterestExists(interest);
    await this.prisma.hasInterest.deleteMany({
      where: {
        AND: {
          accountId: id,
          interestsId: interest,
        },
      },
    });
  }
  async addInterestToPanel(id: number, interest: number): Promise<void> {
    await this.verifyIfInterestExists(interest);
    const interestQuery = await this.prisma.panel.findFirst({
      where: {
        interestsId: interest,
        id: id,
      },
    });
    if (interestQuery)
      throw new BadRequestException('Cet intérêt est déjà lié au stand');
    await this.prisma.panel.update({
      where: {
        id: id,
      },
      data: {
        idInterest: { connect: { id: interest } },
      },
    });
  }

  async removeInterestToPanel(id: number, interest: number): Promise<void> {
    await this.verifyIfInterestExists(interest);
    await this.prisma.panel.update({
      where: { id },
      data: {
        idInterest: null,
      },
    });
  }
}
