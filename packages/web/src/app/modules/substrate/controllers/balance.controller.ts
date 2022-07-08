import {
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import {
  BalanceTransferResult,
  TransferBuildArguments,
} from '@unique-nft/sdk/balance';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import { SdkValidationPipe } from '../../../validation';
import {
  AddressQuery,
  AllBalancesResponse,
  TransferBuildBody,
} from '../../../types/sdk-methods';
import {
  BalanceTransferResultResponse,
  MutationMethod,
} from '../../../decorators/mutation-method';

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

  @MutationMethod(
    Post('transfer'),
    TransferBuildBody,
    BalanceTransferResultResponse,
  )
  @ApiOperation({
    description: 'Transfer balance',
  })
  transferMutation(): MutationMethodWrap<
    TransferBuildArguments,
    BalanceTransferResult
  > {
    return this.sdk.balance.transfer;
  }
}
