import { Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import {Sdk, UnsignedTxPayload} from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  BalanceRequest,
  BalanceResponse,
  BalanceTransferBuildRequest,
  BalanceTransferSubmitRequest,
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
  ): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build({
      address: args.address,
      section: 'balances',
      method: 'transfer',
      args: [args.destination, args.amount],
    });
  }

  @Post('transfer/submit')
  async transferSubmit(
    @Query() args: BalanceTransferSubmitRequest,
  ): Promise<any> {
    const {hash} = await this.sdk.extrinsics.submit(args);
    return {
      hash,
    };
  }
}
