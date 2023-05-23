import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetCompanyTypeDto } from './dto/get-company-type.dto';

@Injectable()
export class CompanyTypeService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyCompanyTypeDoesntExist(
    createCompanyTypeDto: CreateCompanyTypeDto,
  ): Promise<void> {
    const companyType = await this.prisma.companyType.findFirst({
      where: {
        labelCompanyType: createCompanyTypeDto.companyTypeLabel,
      },
    });
    if (companyType)
      throw new BadRequestException("Type d'entreprise déjà existant");
  }

  private async verifyCompanyTypeExists(idCompanyType: number): Promise<void> {
    const companyType = await this.prisma.companyType.findFirst({
      where: {
        id: idCompanyType,
      },
    });
    if (!companyType)
      throw new BadRequestException("Ce type d'entreprise n'existe pas");
  }

  async create(createCompanyTypeDto: CreateCompanyTypeDto, recruit: boolean) {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyCompanyTypeDoesntExist(createCompanyTypeDto);
    await this.prisma.companyType.create({
      data: {
        labelCompanyType: createCompanyTypeDto.companyTypeLabel,
      },
    });
  }

  async findAll(): Promise<GetCompanyTypeDto[]> {
    const companyTypes = await this.prisma.companyType.findMany({
      select: {
        labelCompanyType: true,
      },
    });
    const companyTypeDto: GetCompanyTypeDto[] = [];
    companyTypes.forEach((e) => {
      companyTypeDto.push({
        companyTypeLabel: e.labelCompanyType,
      });
    });
    return companyTypeDto;
  }

  async findOne(id: number) {
    await this.verifyCompanyTypeExists(id);
    const companyType = await this.prisma.companyType.findFirst({
      select: {
        labelCompanyType: true,
      },
      where: {
        id: id,
      },
    });
    let companyTypeDto: GetCompanyTypeDto = null;
    companyTypeDto = {
      companyTypeLabel: companyType.labelCompanyType,
    };
    return companyTypeDto;
  }

  async update(
    id: number,
    updateCompanyTypeDto: UpdateCompanyTypeDto,
    recruit: boolean,
  ): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyCompanyTypeExists;
    await this.prisma.companyType.update({
      where: {
        id: id,
      },
      data: {
        labelCompanyType: updateCompanyTypeDto.companyTypeLabel,
      },
    });
  }

  async remove(id: number, recruit: boolean): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyCompanyTypeExists(id);
    await this.prisma.companyType.delete({
      where: {
        id: id,
      },
    });
  }
}
