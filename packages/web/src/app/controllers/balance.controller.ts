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
  AllBalancesResponse,
  TransferBuildBody,
  UnsignedTxPayloadResponseWithFee,
  WithFeeQuery,
} from '../types/sdk-methods';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly sdk: Sdk) {}

  @Get()
  async getBalance(@Query() args: AddressQuery): Promise<AllBalancesResponse> {
    return this.sdk.balance.get(args);
  }

  @Post('transfer')
  async transferBuild(
    @Query() { withFee }: WithFeeQuery,
    @Body() args: TransferBuildBody,
  ): Promise<UnsignedTxPayloadResponseWithFee> {
    const unsignedTxPayload = await this.sdk.balance.transfer(args);

    if (!withFee) return unsignedTxPayload;

    const fee = await this.sdk.extrinsics.getFee(unsignedTxPayload);

    return { ...unsignedTxPayload, fee };
  }
}
