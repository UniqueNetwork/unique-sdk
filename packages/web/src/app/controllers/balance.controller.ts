import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';

import { Sdk, UnsignedTxPayload } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  BalanceRequest,
  BalanceResponse,
  BalanceTransferBuildRequest,
  BalanceTransferSubmitRequest,
  ExtrinsicSubmitResponse,
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
    @Body() args: BalanceTransferBuildRequest,
  ): Promise<UnsignedTxPayload> {
    return this.sdk.balance.buildTransfer(args);
  }

  @Post('transfer/submit')
  async transferSubmit(
    @Body() args: BalanceTransferSubmitRequest,
  ): Promise<ExtrinsicSubmitResponse> {
    return this.sdk.extrinsics.submit(args);
  }
}
