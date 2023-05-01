import { TokenDTO } from './dto/token.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import CredentialDTO from './dto/credential.dto';

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

  @UseGuards(JwtGuard)
  @ApiOkResponse({
    type: String,
  })
  @Get('test')
  async test(): Promise<string> {
    return 'ça marche';
  }

  @ApiOkResponse({
    type: TokenDTO,
  })
  @ApiForbiddenResponse({
    description: 'email introuvable ou Mot de passe incorrect',
  })
  @HttpCode(HttpStatus.OK)
  @Post('SignIn')
  async login(@Body() credential: CredentialDTO): Promise<TokenDTO> {
    return await this.authService.login(credential);
  }
}
