import { Injectable } from '@nestjs/common';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';

@Injectable()
export class CompanyTypeService {
  create(createCompanyTypeDto: CreateCompanyTypeDto) {
    return 'This action adds a new companyType';
  }

  findAll() {
    return `This action returns all companyType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyType`;
  }

  update(id: number, updateCompanyTypeDto: UpdateCompanyTypeDto) {
    return `This action updates a #${id} companyType`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyType`;
  }
}
