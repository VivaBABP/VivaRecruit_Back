import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApplyJobsService } from './apply-jobs.service';
import { CreateApplyDto } from './dto/create-apply.dto';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { TokenPayload } from '../interfaces/token-payload.interface';

@ApiBearerAuth()
@ApiTags('ApplyJobs')
@Controller('apply-jobs')
export class ApplyJobsController {
  constructor(readonly applyJobsService: ApplyJobsService) {}

  @ApiOkResponse({ description: 'Job postulé avec succès' })
  @UseGuards(JwtGuard)
  @Post()
  async applyJob(
    @Body() applyJobDto: CreateApplyDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.applyJobsService.applyJob(applyJobDto.idJob, req.user.sub);
  }

  /*@ApiOkResponse()
  @UseGuards(JwtGuard)
  @Get()
  async getJobApplied(@Req() req: { user: TokenPayload})*/
}
