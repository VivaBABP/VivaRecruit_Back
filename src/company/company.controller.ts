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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { GetCompanyDto } from './dto/get-company.dto';
import { TokenPayload } from 'src/interfaces/token-payload.interface';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOkResponse({
    type: GetCompanyDto,
    isArray: true,
  })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async findAll(): Promise<GetCompanyDto[]> {
    return await this.companyService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetCompanyDto,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async findOne(@Param('id') id: string): Promise<GetCompanyDto> {
    return await this.companyService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: { user: TokenPayload },
  ) {
    return this.companyService.update(+id, updateCompanyDto, req.user.role);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  remove(
    @Param('id') id: string,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    return this.companyService.remove(+id, req.user.role);
  }
}
