import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddInterestPanelDto {
  @ApiProperty()
  @IsNotEmpty()
  idPanel: number;

  @ApiProperty()
  @IsNotEmpty()
  idInterest: number;
}
