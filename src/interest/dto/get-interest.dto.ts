import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetInterestDto {
  @ApiProperty()
  @IsNotEmpty()
  idInterest: number;

  @ApiProperty()
  @IsNotEmpty()
  labelInterest: string;
}
