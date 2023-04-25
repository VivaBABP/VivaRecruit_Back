import { TokenDTO } from './dto/token.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDTO from './dto/create-user.dto';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';
import { JwtRefreshGuard } from 'src/jwt/guards/jwt-refresh-guard';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    type: TokenDTO,
  })
  @ApiForbiddenResponse({
    description: 'compte déjà existant',
  })
  @Post('signUp')
  async register(@Body() createUser: CreateUserDTO): Promise<TokenDTO> {
    return await this.authService.register(createUser);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: { user: TokenPayload }) {
    return await this.authService.generateToken(req.user);
  }

  @ApiOkResponse({
    type: String,
  })
  @UseGuards(JwtGuard)
  @Get('test')
  async test(): Promise<string> {
    return 'ça marche';
  }
}
