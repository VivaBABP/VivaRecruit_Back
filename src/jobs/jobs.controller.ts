import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import CreateJobDTO from './dto/create-jobs.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { CreateApplyDto } from './dto/create-apply.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';

@ApiBearerAuth()
@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Body() createJob: CreateJobDTO): Promise<void> {
    return await this.jobsService.createJob(createJob);
  }

  //A finir quand on pourra récupérer le Token
  // @Patch(':id')
  // async updateJob(@Body() updateJob: UpdateJobDTO): Promise<string> {
  //   // return await this.jobsService.createJob(createJob);
  //   return 'Ok';
  // }

  @ApiOkResponse({ description: 'Job postulé avec succès' })
  @ApiBadRequestResponse()
  @UseGuards(JwtGuard)
  @Post('apply')
  async applyJob(
    @Body() applyJobDto: CreateApplyDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.jobsService.applyJob(applyJobDto.idJob, req.user.sub);
  }
}
