import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { AddInterestDto } from './dto/add-interest.dto';
import { AddInterestPanelDto } from './dto/add-interest-panel.dto';
import { GetInterestDto } from './dto/get-interest.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Interest')
@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @ApiOkResponse({ type: GetInterestDto, isArray: true })
  @ApiBadRequestResponse()
  @Get()
  async findAll(): Promise<GetInterestDto[]> {
    return await this.interestService.findAll();
  }

  @Post('account')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async addInterestToAccount(
    @Req() req: { user: TokenPayload },
    @Body() idInterest: AddInterestDto,
  ): Promise<void> {
    await this.interestService.addInterestToAccount(
      req.user.sub,
      idInterest.id,
    );
  }

  @Get('account')
  @ApiOkResponse({
    type: GetInterestDto,
    isArray: true,
  })
  @ApiBadRequestResponse()
  async getInterestFromAccount(
    @Req() req: { user: TokenPayload },
  ): Promise<GetInterestDto[]> {
    return await this.interestService.getInterestFromAccount(req.user.sub);
  }

  @Delete('account')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async deleteInterestOfAccount(
    @Req() req: { user: TokenPayload },
    @Body() idInterest: AddInterestDto,
  ): Promise<void> {
    await this.interestService.removeInterestOfAccount(
      req.user.sub,
      idInterest.id,
    );
  }
  @Post('panel')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async addInterestToPanel(@Body() panel: AddInterestPanelDto): Promise<void> {
    await this.interestService.addInterestToPanel(
      panel.idPanel,
      panel.idInterest,
    );
  }

  @Delete('panel')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async removeInterestOfPanel(
    @Body() panel: AddInterestPanelDto,
  ): Promise<void> {
    await this.interestService.removeInterestToPanel(
      panel.idPanel,
      panel.idInterest,
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: GetInterestDto })
  @ApiBadRequestResponse()
  async findInterest(@Param('id') id: string): Promise<GetInterestDto> {
    return await this.interestService.findInterest(+id);
  }
}
