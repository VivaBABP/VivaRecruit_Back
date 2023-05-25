import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class UpdateJobDTO {
  @ApiProperty()
  @IsNotEmpty()
  jobId: number;

  @ApiProperty()
  @IsNotEmpty()
  jobName: string;

  @ApiProperty()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty()
  skillsNeeded?: string;
}
