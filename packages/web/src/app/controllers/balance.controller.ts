import { Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  BalanceRequest,
  BalanceResponse,
  BalanceTransferBuildRequest,
} from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: BalanceRequest): Promise<BalanceResponse> {
    return this.sdk.query.balance(args);
  }

  @Post('transfer/build')
  async transferBuild(
    @Query() args: BalanceTransferBuildRequest,
  ): Promise<any> {
    const txPayload = await this.sdk.buildTx({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, args.amount],
    });

    return {
      payload: txPayload,
    };
  }
}
