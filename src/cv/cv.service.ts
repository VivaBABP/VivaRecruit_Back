import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';

@Injectable()
export class CvService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadCv(file: Express.Multer.File, id: number): Promise<void> {
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
  }
}
