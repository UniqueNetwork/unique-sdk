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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { generateAccount, getAccountFromMnemonic } from '@unique-nft/accounts';

import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { SdkValidationPipe } from '../../../validation';
import {
  AccountDataResponse,
  GenerateAccountDataBody,
  GetAccountDataQuery,
} from '../../../types/signer-payload';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('account')
@Controller('account')
export class AccountController {
  @Get()
  @ApiOperation({
    description:
      'Create valid Substrate-compatible seed from mnemonic. Generate new public key from the seed',
  })
  async getAccount(
    @Query() args: GetAccountDataQuery,
  ): Promise<AccountDataResponse> {
    return getAccountFromMnemonic(args);
  }

  @Post('generate')
  @ApiOperation({
    description:
      'Create mnemonic string using BIP39. Create valid Substrate-compatible seed from mnemonic. Generate new public key from the seed',
  })
  async generate(
    @Body() args: GenerateAccountDataBody,
  ): Promise<AccountDataResponse> {
    return generateAccount(args);
  }
}
