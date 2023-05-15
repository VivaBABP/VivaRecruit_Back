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
} from '@nestjs/common';
import { PanelService } from './panel.service';
import { CreatePanelDto } from './dto/create-panel.dto';
import { UpdatePanelDto } from './dto/update-panel.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPanelDto } from './dto/get-panel.dto';
import { JwtGuard } from '../jwt/guards/jwt.guard';
import { TokenPayload } from '../interfaces/token-payload.interface';
import * as readline from 'readline';
import { GetPanelSuggestionDto } from './dto/get-panel-suggestion.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('panel')
@Controller('panel')
export class PanelController {
  constructor(private readonly panelService: PanelService) {}

  @Post()
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async create(
    @Body() createPanelDto: CreatePanelDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    return await this.panelService.create(createPanelDto, req.user.role);
  }

  @Get()
  @ApiOkResponse({
    type: GetPanelDto,
    isArray: true,
  })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async findAll(): Promise<GetPanelDto[]> {
    return await this.panelService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetPanelDto,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async findOne(@Param('id') id: string): Promise<GetPanelDto> {
    return await this.panelService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  update(
    @Param('id') id: string,
    @Body() updatePanelDto: UpdatePanelDto,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    return this.panelService.update(+id, updatePanelDto, req.user.role);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async remove(
    @Param('id') id: string,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    return await this.panelService.remove(+id, req.user.role);
  }

  @Post('suggestion')
  @ApiOkResponse({
    type: GetPanelDto,
    isArray: true,
  })
  @ApiBadRequestResponse()
  async getSuggestionParcours(
    @Body() panelSuggestionDto: GetPanelSuggestionDto,
  ): Promise<GetPanelDto[]> {
    return await this.panelService.getPanelSuggestion(
      panelSuggestionDto.idInterests,
    );
  }
}
