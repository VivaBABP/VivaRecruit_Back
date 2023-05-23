import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  companyTypeLabel: string;
}
