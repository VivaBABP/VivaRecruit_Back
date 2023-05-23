import {
  Controller,
  Post,
  Get,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  StreamableFile,
  Param,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Express } from 'express';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenPayload } from '../interfaces/token-payload.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Cv')
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @ApiForbiddenResponse()
  @ApiOkResponse({ description: 'Fichier uploadé avec succès' })
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
  ): Promise<void> {
    await this.cvService.uploadCv(file, req.user.sub);
  }

  @ApiOkResponse({
    type: StreamableFile,
  })
  @ApiBadRequestResponse()
  @Get(':idStudent')
  async DownloadCv(
    @Param('idStudent') idStudent: string,
  ): Promise<StreamableFile> {
    const pdf = await this.cvService.downloadCv(+idStudent);
    return new StreamableFile(pdf);
  }
}
