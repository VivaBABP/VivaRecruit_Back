import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetPanelSuggestionDto {
  @ApiProperty()
  @IsNotEmpty()
  idInterests: number[];
}
