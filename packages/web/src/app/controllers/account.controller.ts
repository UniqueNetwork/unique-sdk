/* eslint-disable class-methods-use-this */
import { Body, Query, Controller, Post, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { generateAccount, getAccountFromMnemonic } from '@unique-nft/sdk/sign';

import { SdkExceptionsFilter } from '../utils/exception-filter';
import { validate } from '../validation';
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
  async getAccount(@Query() args: GetAccountQuery): Promise<AccountResponse> {
    await validate(args, GetAccountQuery);
    return getAccountFromMnemonic(args);
  }

  @Post('generate')
  async generate(@Body() args: GenerateAccountBody): Promise<AccountResponse> {
    await validate(args, GenerateAccountBody);
    return generateAccount(args);
  }
}
