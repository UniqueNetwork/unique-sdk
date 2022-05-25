import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';

import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { validate } from '../validation';
import {
  AddressQuery,
  BalanceResponse,
  TransferBuildBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressQuery): Promise<BalanceResponse> {
    await validate(args, AddressQuery);
    return this.sdk.balance.get(args);
  }

  @Post('transfer')
  async transferBuild(
    @Body() args: TransferBuildBody,
  ): Promise<UnsignedTxPayloadResponse> {
    await validate(args, TransferBuildBody);
    return this.sdk.balance.transfer(args);
  }
}
