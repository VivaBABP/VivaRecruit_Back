import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { TokenDTO } from 'src/auth/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUser: CreateUserDTO): Promise<TokenDTO> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: createUser.email,
      },
    });

    if (query) {
      throw new ForbiddenException('compte déjà existant');
    }

    const hashedPassword = await bcrypt.hash(
      createUser.password,
      parseInt(process.env.SALT),
    );

    const user = await this.prisma.account.create({
      data: {
        email: createUser.email,
        password: hashedPassword,
        hr: createUser.recruit,
        refreshToken: 'salut',
      },
    });

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.hr,
    };

    return await this.generateToken(payload);
  }

  async generateToken(payload: TokenPayload): Promise<TokenDTO> {
    const access_token = await this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: process.env.JWT,
        expiresIn: '30m',
      },
    );

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: process.env.REFRESH,
        expiresIn: '7d',
      },
    );

    const refreshTokenHashed = await bcrypt.hash(
      refresh_token,
      parseInt(process.env.SALT),
    );

    await this.prisma.account.update({
      data: {
        refreshToken: refreshTokenHashed,
      },
      where: {
        id: payload.sub,
      },
    });

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    payload: TokenPayload,
  ): Promise<TokenPayload> {
    const refreshTokenDB = await this.prisma.account.findUnique({
      select: {
        refreshToken: true,
      },
      where: {
        id: payload.sub,
      },
    });

    if (!refreshTokenDB) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      refreshTokenDB.refreshToken,
    );

    if (!isMatch) {
      throw new ForbiddenException();
    }

    return payload;
  }
}
