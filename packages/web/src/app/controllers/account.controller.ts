/* eslint-disable class-methods-use-this */
import { Body, Query, Controller, Post, Get, UseFilters } from '@nestjs/common';
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
  @Get()
  async getAccount(@Query() args: GetAccountArgs): Promise<Account> {
    return getAccountFromMnemonic(args);
  }

  @Post('generate')
  async generate(@Body() args: GenerateAccountArgs): Promise<Account> {
    return generateAccount(args);
  }
}
