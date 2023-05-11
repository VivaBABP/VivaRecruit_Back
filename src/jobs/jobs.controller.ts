import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import CreateJobDTO from './dto/create-jobs.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';

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
}
