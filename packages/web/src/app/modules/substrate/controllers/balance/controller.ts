import {
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UsePipes,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Sdk } from '@unique-nft/sdk';
import { BalanceTransferResult } from '@unique-nft/sdk/balance';
import { SdkExceptionsFilter } from '../../../../utils/exception-filter';
import { SdkValidationPipe } from '../../../../validation';
import {
  AddressQuery,
  AllBalancesResponse,
} from '../../../../types/sdk-methods';
import {
  MutationMethod,
  MutationMethodOptions,
} from '../../../../decorators/mutation-method';
import { BalanceTransferBody, BalanceTransferResponse } from './types';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(
    private readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async getBalance(@Query() args: AddressQuery): Promise<AllBalancesResponse> {
    throw new Error('test error');
    return this.sdk.balance.get(args);
  }

  @MutationMethod(
    Post('transfer'),
    BalanceTransferBody,
    BalanceTransferResponse,
  )
  @ApiOperation({
    description: 'Transfer balance',
  })
  transferMutation(): MutationMethodOptions {
    return {
      mutationMethod: this.sdk.balance.transfer,
      cache: this.cache,
    };
  }
}
