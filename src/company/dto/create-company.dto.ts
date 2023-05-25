import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
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
  companyTypeId: number;
}
