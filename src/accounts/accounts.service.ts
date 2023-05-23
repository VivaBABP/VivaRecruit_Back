import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import InformationUserDTO from './dto/information-user.dto';
import InformationStudentDTO from './dto/information-students.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async addUserInformation(
    addUserInformation: InformationUserDTO,
    id: number,
  ): Promise<void> {
    const accountActive = await this.prisma.account.findFirst({
      where: {
        id: id,
      },
    });
    if (!accountActive.activate) {
      throw new ForbiddenException('Compte non activé');
    }
    if (!accountActive) throw new BadRequestException("Le compte n'existe pas");

    await this.prisma.account.update({
      where: {
        id: id,
      },
      data: {
        name: addUserInformation.name,
        lastName: addUserInformation.lastName,
        phoneNumber: addUserInformation.phoneNumber,
        lastDiploma: addUserInformation.lastDiploma,
      },
    });
  }

  async getStudents(role: boolean): Promise<InformationStudentDTO[]> {
    if (!role)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    const result = await this.prisma.account.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
      },
      where: {
        hr: false,
        activate: true,
        cv: {
          not: null,
        },
      },
    });
    return result as InformationStudentDTO[];
  }
}
