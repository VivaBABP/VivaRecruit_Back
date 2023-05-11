import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Express } from 'express';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    await this.cvService.uploadCv(file, 2); //Mise du cv dans un user spécifique car l'on ne récupère pas les données du token
  }
}
