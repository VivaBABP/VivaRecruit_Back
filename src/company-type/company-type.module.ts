import { Module } from '@nestjs/common';
import { CompanyTypeService } from './company-type.service';
import { CompanyTypeController } from './company-type.controller';

@Module({
  controllers: [CompanyTypeController],
  providers: [CompanyTypeService],
})
export class CompanyTypeModule {}
