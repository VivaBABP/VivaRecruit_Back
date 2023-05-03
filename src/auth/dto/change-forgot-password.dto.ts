import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

export class ChangeForgotPasswordDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @Min(1)
  @Max(4)
  @IsNotEmpty()
  code: number;
}
