import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isNotEmpty } from 'class-validator';

export default class InformationUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    accountId: number;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    lastDiploma: string;
}
