import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';

import { ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { SdkValidationPipe } from '../validation';
import {
  AddressQuery,
  BalanceResponse,
  TransferBuildBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';

@UsePipes(new SdkValidationPipe({}))
@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressQuery): Promise<BalanceResponse> {
    return this.sdk.balance.get(args);
  }

  @Post('transfer')
  async transferBuild(
    @Body() args: TransferBuildBody,
  ): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.balance.transfer(args);
  }
}
