import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Express } from 'express';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenPayload } from '../interfaces/token-payload.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cv')
@ApiBearerAuth()
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtGuard)
  @ApiForbiddenResponse()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: TokenPayload },
  ) {
    console.log(req);
    await this.cvService.uploadCv(file, req.user.sub); //Mise du cv dans un user spécifique car l'on ne récupère pas les données du token
  }
}
