import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';

@Injectable()
export class CvService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCv(file: Express.Multer.File, id: number): Promise<string> {
    if (!file) throw new BadRequestException('Aucun fichier envoyé');
    if (file.mimetype != 'application/pdf') {
      throw new ForbiddenException('Format du fichier incorrect');
    }
    if (file.size > 20000000) {
      throw new ForbiddenException('Fichier trop lourd');
    }
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
