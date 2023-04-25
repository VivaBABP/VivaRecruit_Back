import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  recruit: boolean;
}
