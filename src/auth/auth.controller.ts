import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDTO from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async register(@Body() createUser: CreateUserDTO): Promise<void> {
    await this.authService.register(createUser);
  }
}
