import { Controller, Get, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ChainProperties } from '@unique-nft/sdk/types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('chain')
@Controller('chain')
export class ChainController {
  constructor(private readonly sdk: Sdk) {}

  @Get('properties')
  @ApiResponse({ type: ChainProperties })
  async getChainProperties(): Promise<ChainProperties> {
    return this.sdk.chainProperties();
  }
}
