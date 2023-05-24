import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';
import { ApiOkResponse } from '@nestjs/swagger';

@Injectable()
export class CvService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCv(file: Express.Multer.File, id: number): Promise<string> {
    if (!file) throw new BadRequestException('Aucun fichier envoyé');
    console.log(file + ' pdf');
    await this.prisma.account.update({
      data: {
        cv: file.buffer,
      },
      where: {
        id: id,
      },
    });
    return 'Fichier uploadé avec succès';
  }

  async downloadCv(id: number): Promise<Buffer> {
    const result = await this.prisma.account.findFirst({
      select: {
        cv: true,
      },
      where: {
        id: id,
      },
    });

    if (!result) throw new BadRequestException("L'etudiant n'existe pas");
    if (!result.cv) throw new BadRequestException('Aucun CV trouvé');

    return result.cv;
  }
}
