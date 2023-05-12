import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiCreatedResponse({
    type: String,
  })
  async createJob(
    @Req() req: { user: TokenPayload },
    @Body() createJob: CreateJobDTO,
  ): Promise<string> {
    await this.jobsService.createJob(createJob, req.user.sub);
    return 'Job créé avec succès';
  }

  //A finir quand on pourra récupérer le Token
  // @Patch(':id')
  // async updateJob(@Body() updateJob: UpdateJobDTO): Promise<string> {
  //   // return await this.jobsService.createJob(createJob);
  //   return 'Ok';
  // }

  @ApiOkResponse({ description: 'Job postulé avec succès' })
  @ApiBadRequestResponse()
  @Post('apply')
  async applyJob(
    @Body() applyJobDto: CreateApplyDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.jobsService.applyJob(applyJobDto.idJob, req.user.sub);
  }

  @Get()
  async getAppliedJobs(
    @Req() req: { user: TokenPayload },
  ): Promise<CreateJobDTO[]> {
    return await this.jobsService.getAppliedJob(req.user.sub);
  }
}
