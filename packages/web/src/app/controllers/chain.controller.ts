import { Controller, Get, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ChainPropertiesDto } from '../types/sdk-methods';

@UseFilters(SdkExceptionsFilter)
@ApiTags('chain')
@Controller('chain')
export class ChainController {
  constructor(private readonly sdk: Sdk) {}

  @Get('properties')
  @ApiResponse({ type: ChainPropertiesDto })
  async getChainProperties(): Promise<ChainPropertiesDto> {
    return this.sdk.chainProperties();
  }
}
