import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddInterestDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
