import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<void> {
    await this.prisma.company.create({
      data: {
        companyName: createCompanyDto.CompanyName,
        description: createCompanyDto.Description,
        websiteLink: createCompanyDto.WebsiteLink,
        lineOfBusiness: createCompanyDto.LineOfBusiness,
        companyTypeId: createCompanyDto.CompanyType,
      },
    });
  }
  
  async findAll(): Promise<void> {
    const companies = await this.prisma.company.findMany({
      select: {
        companyName: true,

      },
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
