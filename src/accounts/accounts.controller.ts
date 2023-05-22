import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import InformationUserDTO from '../accounts/dto/information-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { TokenPayload } from 'src/interfaces/token-payload.interface';
import { JwtGuard } from 'src/jwt/guards/jwt.guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @ApiCreatedResponse()
  @ApiForbiddenResponse({
    description: 'Mauvais utilisateur',
  })
  @Patch()
  @ApiOkResponse({ description: 'Vos informations de compte sont enregistées' })
  @ApiBadRequestResponse()
  async addUserInformation(
    @Body() updateAccounts: InformationUserDTO,
    @Req() req: { user: TokenPayload },
  ): Promise<void> {
    await this.accountsService.addUserInformation(updateAccounts, req.user.sub);
  }
}
