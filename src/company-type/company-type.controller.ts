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
import { CompanyTypeService } from './company-type.service';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { GetCompanyTypeDto } from './dto/get-company-type.dto';
import { GetPanelDto } from 'src/panel/dto/get-panel.dto';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('company-type')
@Controller('company-type')
export class CompanyTypeController {
  constructor(private readonly companyTypeService: CompanyTypeService) {}

  @Post()
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async create(
    @Body() createCompanyTypeDto: CreateCompanyTypeDto,
    @Req() req: { user: TokenPayload },
  ) {
    return await this.companyTypeService.create(
      createCompanyTypeDto,
      req.user.role,
    );
  }

  @Get()
  @ApiOkResponse({
    type: GetPanelDto,
    isArray: true,
  })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async findAll(): Promise<GetCompanyTypeDto[]> {
    return await this.companyTypeService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetPanelDto,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async findOne(@Param('id') id: string): Promise<GetCompanyTypeDto> {
    return await this.companyTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  update(
    @Param('id') id: string,
    @Body() updateCompanyTypeDto: UpdateCompanyTypeDto,
    @Req() req: { user: TokenPayload },
  ) {
    return this.companyTypeService.update(
      +id,
      updateCompanyTypeDto,
      req.user.role,
    );
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async remove(@Param('id') id: string, @Req() req: { user: TokenPayload }) {
    return await this.companyTypeService.remove(+id, req.user.role);
  }
}
