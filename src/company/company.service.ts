import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GetCompanyDto } from './dto/get-company.dto';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  private async verifyCompanyExists(idCompany: number): Promise<void> {
    const company = await this.prisma.company.findFirst({
      where: {
        id: idCompany,
      },
    });
    if (!company)
      throw new BadRequestException("Cette entreprise n'existe pas");
  }

  async create(
    createCompanyDto: CreateCompanyDto,
    user: TokenPayload,
  ): Promise<void> {
    if (!user.role)
      throw new ForbiddenException(
        "Vous n'avez pas les droits pour créer une entreprise",
      );
    await this.prisma.company.create({
      data: {
        companyName: createCompanyDto.companyName,
        description: createCompanyDto.description,
        websiteLink: createCompanyDto.websiteLink,
        lineOfBusiness: createCompanyDto.lineOfBusiness,
        companyTypeId: createCompanyDto.companyTypeId,
      },
    });
  }

  async findAll(): Promise<GetCompanyDto[]> {
    const companies = await this.prisma.company.findMany({
      select: {
        companyName: true,
        description: true,
        websiteLink: true,
        lineOfBusiness: true,
        companyType: {
          select: {
            labelCompanyType: true,
          },
        },
      },
    });
    const companyDto: GetCompanyDto[] = [];
    companies.forEach((e) => {
      companyDto.push({
        companyName: e.companyName,
        description: e.description,
        websiteLink: e.websiteLink,
        lineOfBusiness: e.lineOfBusiness,
        companyTypeLabel: e.companyType.labelCompanyType,
      });
    });
    return companyDto;
  }

  async findOwnCompany(user: TokenPayload): Promise<GetCompanyDto> {
    if (!user.role) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits de faire cette requête",
      );
    }
    const res = await this.prisma.panel.findFirst({
      where: {
        Account: {
          every: {
            id: user.sub,
          },
        },
      },
      select: {
        company: {
          select: {
            id: true,
            companyType: true,
            websiteLink: true,
            companyTypeId: true,
            description: true,
            lineOfBusiness: true,
            companyName: true,
          },
        },
      },
    });
    return {
      companyName: res.company.companyName,
      description: res.company.description,
      websiteLink: res.company.websiteLink,
      lineOfBusiness: res.company.lineOfBusiness,
      companyTypeLabel: res.company.companyType.labelCompanyType,
    };
  }

  async findOne(id: number): Promise<GetCompanyDto> {
    await this.verifyCompanyExists(id);
    const company = await this.prisma.company.findFirst({
      select: {
        companyName: true,
        description: true,
        websiteLink: true,
        lineOfBusiness: true,
        companyType: {
          select: {
            labelCompanyType: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
    let companyDto: GetCompanyDto = null;
    companyDto = {
      companyName: company.companyName,
      description: company.description,
      websiteLink: company.websiteLink,
      lineOfBusiness: company.lineOfBusiness,
      companyTypeLabel: company.companyType.labelCompanyType,
    };
    return companyDto;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    recruit: boolean,
  ) {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyCompanyExists(id);
    const companyType = await this.prisma.companyType.findFirst({
      where: {
        id: updateCompanyDto.companyTypeId,
      },
    });
    if (!companyType)
      throw new BadRequestException("Ce type d'entreprise n'existe pas");
    await this.prisma.company.update({
      where: { id: id },
      data: {
        companyName: updateCompanyDto.companyName,
        description: updateCompanyDto.description,
        websiteLink: updateCompanyDto.websiteLink,
        lineOfBusiness: updateCompanyDto.lineOfBusiness,
        companyTypeId: updateCompanyDto.companyTypeId,
      },
    });
  }

  async remove(id: number, recruit: boolean): Promise<void> {
    if (!recruit)
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à executer cette action",
      );
    await this.verifyCompanyExists(id);
    await this.prisma.company.delete({
      where: {
        id: id,
      },
    });
  }
}
