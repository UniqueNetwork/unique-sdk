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
  UnsignedTxPayloadResponseWithFee,
} from '../types/sdk-methods';

@UsePipes(SdkValidationPipe)
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
    @Body() { withFee, ...rest }: TransferBuildBody,
  ): Promise<UnsignedTxPayloadResponseWithFee> {
    const unsignedTxPayload = await this.sdk.balance.transfer(rest);

    if (!withFee) return unsignedTxPayload;

    const fee = await this.sdk.extrinsics.getFee(unsignedTxPayload);

    return { ...unsignedTxPayload, fee };
  }
}
