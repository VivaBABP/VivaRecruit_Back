import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class UploadCvDTO {
  @ApiProperty()
  cv: FormData;
}
