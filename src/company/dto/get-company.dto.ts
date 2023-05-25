import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  idCompany: number;

  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  websiteLink: string;

  @ApiProperty()
  lineOfBusiness: string;

  @ApiProperty()
  @IsNotEmpty()
  idTypeCompany: number;

  @ApiProperty()
  companyTypeLabel: string;
}
