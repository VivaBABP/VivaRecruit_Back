import {  Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    Req,
    UseGuards,
 } from '@nestjs/common';
import  InformationUserDTO from '../accounts/dto/information-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Accounts')
@ApiCreatedResponse()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

    @Patch()
    @ApiOkResponse({ description: 'Le job à bien été modifié' })
    @ApiBadRequestResponse()
    async addUserInformation(
      @Body() updateAccounts: InformationUserDTO ,
    ): Promise<void> {
      await this.accountsService.addUserInformation(updateAccounts );
    }
}
