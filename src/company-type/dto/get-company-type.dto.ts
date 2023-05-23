import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetCompanyTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  companyTypeLabel: string;
}
