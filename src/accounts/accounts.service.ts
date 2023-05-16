import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import InformationUserDTO from './dto/information-user.dto';

@Injectable()
export class AccountsService {
    constructor(
        private readonly prisma: PrismaService,
      ) {}


    async addUserInformation(addUserInformation: InformationUserDTO): Promise<void> {
      const accountActive = await this.prisma.account.findFirst({
        where: {
          id: addUserInformation.accountId,
        }
      });
        if (!accountActive.activate) {
          throw new ForbiddenException('Compte non activé');
        } 
    
        await this.prisma.account.update({
          where: {
            id: addUserInformation.accountId,
          },
          data: {
            name: addUserInformation.name,
            lastName: addUserInformation.lastName,
            phoneNumber: addUserInformation.phoneNumber,
            lastDiploma: addUserInformation.lastDiploma,
          },
        });
    
     
      }


}