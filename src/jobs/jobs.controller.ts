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
import { CreateApplyDto } from '../apply/dto/create-apply.dto';
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
    return await this.jobsService.updateJob(updateJob, req.user.sub);
  }

  @Get()
  @ApiOkResponse({
    type: UpdateJobDTO,
    isArray: true,
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
}
