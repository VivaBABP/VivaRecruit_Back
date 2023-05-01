import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { JwtRefreshGuard } from '../jwt/guards/jwt-refresh-guard';
import { Express } from 'express';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: TokenPayload },
  ) {
    await this.cvService.uploadCv(file, 2); //Mise du cv dans un user spécifique car l'on ne récupère pas les données du token
  }
}
