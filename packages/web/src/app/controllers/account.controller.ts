/* eslint-disable class-methods-use-this */
import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Account,
  GenerateAccountArgs,
  generateAccount,
  getAccountFromMnemonic,
  GetAccountArgs,
} from '@unique-nft/sdk/sign';

import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('account')
@Controller('account')
export class AccountController {
  @Post('generate')
  async generate(@Body() args: GenerateAccountArgs): Promise<Account> {
    return generateAccount(args);
  }

  @Post('create')
  async create(@Body() args: GetAccountArgs): Promise<Account> {
    return getAccountFromMnemonic(args);
  }
}
