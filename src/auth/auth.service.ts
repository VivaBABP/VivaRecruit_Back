import { ForbiddenException, Injectable } from '@nestjs/common';
import CreateUserDTO from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(createUser: CreateUserDTO): Promise<any> {
    const query = await this.prisma.account.findFirst({
      where: {
        email: createUser.email,
      },
    });

    if (!query) return new ForbiddenException('compte déjà existant');

    return 'le compte existe :D';
  }
}
