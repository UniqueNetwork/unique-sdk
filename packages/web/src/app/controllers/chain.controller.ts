import { Controller, Get, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ChainPropertiesResponse } from '../types/sdk-methods';

@UseFilters(SdkExceptionsFilter)
@ApiTags('chain')
@Controller('chain')
export class ChainController {
  constructor(private readonly sdk: Sdk) {}

  @Get('properties')
  @ApiResponse({ type: ChainPropertiesResponse })
  async getChainProperties(): Promise<ChainPropertiesResponse> {
    return this.sdk.chainProperties();
  }
}
