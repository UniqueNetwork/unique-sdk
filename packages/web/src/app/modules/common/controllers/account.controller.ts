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

import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { SdkValidationPipe } from '../../../validation';
import {
  AccountResponse,
  GenerateAccountBody,
  GetAccountQuery,
} from '../../../types/signer-payload';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('account')
@Controller('account')
export class AccountController {
  @Get()
  async getAccount(@Query() args: GetAccountQuery): Promise<AccountResponse> {
    return getAccountFromMnemonic(args);
  }

  @Post('generate')
  async generate(@Body() args: GenerateAccountBody): Promise<AccountResponse> {
    return generateAccount(args);
  }
}
