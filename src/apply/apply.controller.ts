import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplyService } from './apply.service';
import { CreateApplyDto } from './dto/create-apply.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import UpdateJobDTO from '../jobs/dto/update-job.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Apply')
@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @ApiOkResponse({ isArray: true, type: UpdateJobDTO })
  @ApiBadRequestResponse()
  @Get()
  findAll(@Req() req: { user: TokenPayload }): Promise<UpdateJobDTO[]> {
    return this.applyService.getAppliedJob(req.user.sub);
  }

  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post()
  async applyJob(
    @Body() applyJobDto: CreateApplyDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    return await this.applyService.applyJob(applyJobDto.idJob, req.user.sub);
  }
  @Delete(':idJob')
  @ApiBadRequestResponse()
  @ApiOkResponse()
  async deleteAppliedJob(
    @Req() req: { user: TokenPayload },
    @Param('idJob') idJob: string,
  ): Promise<void> {
    return await this.applyService.deleteAppliedJob(
      req.user.sub,
      Number.parseInt(idJob),
    );
  }
}
