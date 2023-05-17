import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetPanelDto {
  @ApiProperty()
  @IsNotEmpty()
  panelName: string;

  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  interestLabel: string;
}
