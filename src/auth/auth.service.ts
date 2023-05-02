import { ValidationCodeDTO } from './dto/validation-code.dto';
import {
  BadRequestException,
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
import CredentialDTO from './dto/credential.dto';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(createUser: CreateUserDTO): Promise<number> {
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

    const activationCode = Math.floor(Math.random() * 10000 + 1);

    const test = new Date();
    test.setDate(test.getDate() - 1);

    const user = await this.prisma.account.create({
      data: {
        email: createUser.email,
        password: hashedPassword,
        hr: createUser.recruit,
        refreshToken: '',
        activate: false,
        codeActivate: activationCode,
        createdAt: test,
      },
    });

    try {
      await this.mailService.sendConfirmationCode(activationCode, user.email);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return user.id;
  }

  async emailValidation(validationCode: ValidationCodeDTO): Promise<TokenDTO> {
    const user = await this.prisma.account.findFirst({
      where: {
        id: validationCode.idUser,
      },
    });

    if (!user) {
      throw new ForbiddenException("ce compte n'existe pas");
    } else if (user.activate) {
      throw new ForbiddenException('Compte déjà activé');
    } else if (user.codeActivate != validationCode.code) {
      throw new ForbiddenException('Code incorrect');
    }

    await this.prisma.account.update({
      data: {
        codeActivate: null,
        activate: true,
      },
      where: {
        id: validationCode.idUser,
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

  async login(credential: CredentialDTO): Promise<TokenDTO> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: credential.email,
      },
    });

    if (!query) {
      throw new ForbiddenException('email introuvable');
    }
    const verifyPwd = await bcrypt.compare(credential.password, query.password);
    if (!verifyPwd) {
      throw new ForbiddenException('Mot de passe incorrect');
    }
    const payload: TokenPayload = {
      sub: query.id,
      email: query.email,
      role: query.hr,
    };
    return await this.generateToken(payload);
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async deleteDesactivateAccount(): Promise<void> {
    const users = await this.prisma.account.findMany();

    users.forEach(async (u) => {
      const userDate = dayjs(u.createdAt).startOf('day');
      const today = dayjs().startOf('day');

      if (today > userDate && !u.activate) {
        await this.prisma.account.delete({
          where: {
            id: u.id,
          },
        });
      }
    });
  }
}
