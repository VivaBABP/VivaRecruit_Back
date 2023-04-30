import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class CreateJobDTO {
  @ApiProperty()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty()
  skillsNeeded?: string;
}
