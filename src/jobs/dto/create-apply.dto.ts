import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateApplyDto {
  @ApiProperty()
  @IsNotEmpty()
  idJob: number;
}
