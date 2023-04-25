import { ForbiddenException, Injectable } from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(createUser: CreateUserDTO): Promise<void> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: createUser.email,
      },
    });

    if (query) throw new ForbiddenException('compte déjà existant');

    const hashedPassword = await bcrypt.hash(
      createUser.password,
      parseInt(process.env.SALT),
    );

    await this.prisma.account.create({
      data: {
        email: createUser.email,
        password: hashedPassword,
        hr: createUser.recruit,
      },
    });
  }
}
