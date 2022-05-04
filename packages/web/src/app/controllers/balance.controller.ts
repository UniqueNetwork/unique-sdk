import { Controller, Get, Query, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { BalanceRequest, BalanceResponse } from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: BalanceRequest): Promise<BalanceResponse> {
    return this.sdk.getBalance(args);
  }
}
