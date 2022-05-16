import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import {
  Sdk,
  Balance,
  TransferBuildArgs,
  AddressArg,
  SubmitResult,
} from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressArg): Promise<Balance> {
    return this.sdk.query.balance(args);
  }

  @Post('transfer')
  async transferBuild(
    @Body() args: TransferBuildArgs,
  ): Promise<UnsignedTxPayload | SubmitResult> {
    return this.sdk.balance.buildTransfer(args);
  }
}
