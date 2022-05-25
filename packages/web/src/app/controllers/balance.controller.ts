import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';

import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { validate } from '../validation';
import {
  AddressArgDto,
  BalanceDto,
  TransferBuildArgsDto,
  UnsignedTxPayloadDto,
} from '../types/sdk-methods';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressArgDto): Promise<BalanceDto> {
    await validate(args, AddressArgDto);
    return this.sdk.balance.get(args);
  }

  @Post('transfer')
  async transferBuild(
    @Body() args: TransferBuildArgsDto,
  ): Promise<UnsignedTxPayloadDto> {
    await validate(args, TransferBuildArgsDto);
    return this.sdk.balance.transfer(args);
  }
}
