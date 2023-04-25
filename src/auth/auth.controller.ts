import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDTO from './dto/create-user.dto';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { Token } from 'src/interfaces/token.interface';
import { JwtRefreshGuard } from 'src/jwt/guards/jwt-refresh-guard';
import { TokenPayload } from 'src/interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async register(@Body() createUser: CreateUserDTO): Promise<Token> {
    return this.authService.register(createUser);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: { user: TokenPayload }) {
    const token = await this.authService.generateToken(req.user);
    return token;
  }

  @UseGuards(JwtGuard)
  @Get('test')
  async test(): Promise<string> {
    return 'ça marche';
  }
}
