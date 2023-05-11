import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import UploadCvDTO from './dto/upload-cv.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Express } from 'express';

@Injectable()
export class CvService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
