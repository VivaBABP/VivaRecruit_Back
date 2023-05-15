import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePanelDto {
  @ApiProperty()
  @IsNotEmpty()
  namePanel: string;

  @ApiProperty()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  interestsId: number;
}
