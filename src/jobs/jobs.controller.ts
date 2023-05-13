import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import CreateJobDTO from './dto/create-jobs.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { CreateApplyDto } from './dto/create-apply.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';
import UpdateJobDTO from './dto/update-job.dto';

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

  @Patch()
  @ApiOkResponse({ description: 'Le job à bien été modifié' })
  @ApiBadRequestResponse()
  async updateJob(
    @Body() updateJob: UpdateJobDTO,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.jobsService.updateJob(updateJob, req.user.sub);
  }

  @Get()
  @ApiOkResponse({
    type: UpdateJobDTO,
  })
  async getJobs(): Promise<UpdateJobDTO[]> {
    return await this.jobsService.getJobs();
  }

  @Get(':id')
  @ApiOkResponse({
    type: UpdateJobDTO,
  })
  async getJob(@Param('id') id: string): Promise<UpdateJobDTO> {
    return await this.jobsService.getJob(Number.parseInt(id));
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post('apply')
  async applyJob(
    @Body() applyJobDto: CreateApplyDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.jobsService.applyJob(applyJobDto.idJob, req.user.sub);
  }

  @ApiOkResponse({
    type: CreateJobDTO,
  })
  @Get('applied')
  async getAppliedJobs(
    @Req() req: { user: TokenPayload },
  ): Promise<CreateJobDTO[]> {
    return await this.jobsService.getAppliedJob(req.user.sub);
  }

  @Delete('applied/:idJob')
  @ApiOkResponse()
  async deleteAppliedJob(
    @Req() req: { user: TokenPayload },
    @Param('idJob') idJob: string,
  ): Promise<void> {
    await this.jobsService.deleteAppliedJob(
      req.user.sub,
      Number.parseInt(idJob),
    );
  }
}
