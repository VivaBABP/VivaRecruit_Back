import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidationCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  idUser: number;
  @IsNotEmpty()
  code: number;
}
