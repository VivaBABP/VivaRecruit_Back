import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidationCodeDTO {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  code: number;
}
