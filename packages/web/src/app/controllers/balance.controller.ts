import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';

import {
  Balance,
  TransferBuildArgs,
  AddressArg,
  SubmitResult,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressArg): Promise<Balance> {
    return this.sdk.balance.get(args);
  }

  @Post('transfer')
  async transferBuild(
    @Body() args: TransferBuildArgs,
  ): Promise<UnsignedTxPayload | SubmitResult> {
    return this.sdk.balance.transfer(args);
  }
}
