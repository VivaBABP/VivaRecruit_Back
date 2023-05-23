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
import dayjs from 'dayjs';
import { Account } from '@prisma/client';
import { ChangeForgotPasswordDTO } from './dto/change-forgot-password.dto';
import InformationUserDTO from '../accounts/dto/information-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private async verifyIfUserExist(email: string): Promise<Account> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: email,
      },
    });

    if (query) {
      throw new UnauthorizedException('compte déjà existant');
    }

    return query;
  }

  private async verifyIfUserDontExist(email: string): Promise<Account> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: email,
      },
    });

    if (!query) {
      throw new UnauthorizedException("le Compte n'existe pas");
    }

    return query;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, parseInt(process.env.SALT));
  }

  async register(createUser: CreateUserDTO): Promise<void> {
    await this.verifyIfUserExist(createUser.email);

    const hashedPassword = await this.hashPassword(createUser.password);

    const activationCode = Math.floor(Math.random() * (10000 - 1000) + 1000);

    const user = await this.prisma.account.create({
      data: {
        email: createUser.email,
        password: hashedPassword,
        hr: createUser.recruit,
        refreshToken: '',
        activate: false,
        codeActivate: activationCode,
      },
    });

    try {
      await this.mailService.sendConfirmationCode(activationCode, user.email);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async emailValidation(validationCode: ValidationCodeDTO): Promise<TokenDTO> {
    const user = await this.verifyIfUserDontExist(validationCode.email);

    if (user.activate) {
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
        email: validationCode.email,
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
        codeActivate: null,
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
    const query = await this.verifyIfUserDontExist(credential.email);

    if (!query.activate) {
      throw new ForbiddenException("Ce compte n'est pas activé");
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

  async sendEmailForgotPassword(email: string): Promise<void> {
    const query = await this.verifyIfUserDontExist(email);

    if (!query.activate) {
      throw new ForbiddenException('Compte non activé');
    }

    const activationCode = Math.floor(Math.random() * (10000 - 1000) + 1000);

    await this.prisma.account.update({
      data: {
        codeActivate: activationCode,
      },
      where: {
        email: email,
      },
    });

    await this.mailService.sendEmailForgotPassword(activationCode, email);
  }

  async changeForgotPassword(
    ChangePassword: ChangeForgotPasswordDTO,
  ): Promise<void> {
    const query = await this.verifyIfUserDontExist(ChangePassword.email);

    if (!query.activate) {
      throw new UnauthorizedException();
    } else if (query.codeActivate != ChangePassword.code) {
      throw new ForbiddenException();
    }

    const hashedPassword = await this.hashPassword(ChangePassword.password);

    await this.prisma.account.update({
      data: {
        password: hashedPassword,
        codeActivate: null,
      },
      where: {
        id: query.id,
      },
    });
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
