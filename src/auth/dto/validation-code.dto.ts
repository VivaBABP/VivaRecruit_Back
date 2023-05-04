import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class ValidationCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  idUser: number;
  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @Max(4)
  code: number;
}
