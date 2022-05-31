/* eslint-disable class-methods-use-this */
import {
  Body,
  Query,
  Controller,
  Post,
  Get,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { generateAccount, getAccountFromMnemonic } from '@unique-nft/sdk/sign';

import { SdkExceptionsFilter } from '../utils/exception-filter';
import { CustomValidationPipe } from '../validation';
import {
  AccountResponse,
  GenerateAccountBody,
  GetAccountQuery,
} from '../types/signer-payload';

@UseFilters(SdkExceptionsFilter)
@ApiTags('account')
@Controller('account')
export class AccountController {
  @Get()
  @UsePipes(new CustomValidationPipe({}))
  async getAccount(@Query() args: GetAccountQuery): Promise<AccountResponse> {
    return getAccountFromMnemonic(args);
  }

  @Post('generate')
  @UsePipes(new CustomValidationPipe({}))
  async generate(@Body() args: GenerateAccountBody): Promise<AccountResponse> {
    return generateAccount(args);
  }
}
