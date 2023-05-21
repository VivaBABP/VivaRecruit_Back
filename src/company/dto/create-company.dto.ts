import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  CompanyName: string;

  @ApiProperty()
  Description: string;

  @ApiProperty()
  WebsiteLink: string;

  @ApiProperty()
  LineOfBusiness: string;

  @ApiProperty()
  CompanyType: number;
}
