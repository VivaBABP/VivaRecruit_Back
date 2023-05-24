import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class GetJobsDTO {
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

  @ApiProperty()
  @IsNotEmpty()
  applied: boolean;
}
