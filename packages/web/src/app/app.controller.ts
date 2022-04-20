import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import {
  ChainPropertiesDto,
  GetBalanceArgsDto,
  BalanceDto,
  UnsignedTxPayloadDto,
  BuildTxDto,
  SubmitTxArgsDto,
  SubmitResultDto,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly sdk: Sdk) {}

  @Get('chain_properties')
  async getChainProperties(): Promise<ChainPropertiesDto> {
    return await this.sdk.getChainProperties();
  }

  @Get('balance')
  async getBalance(@Query() args: GetBalanceArgsDto): Promise<BalanceDto> {
    return await this.sdk.getBalance(args);
  }

  @Post('build_tx')
  async buildTx(@Body() args: BuildTxDto): Promise<UnsignedTxPayloadDto> {
    return await this.sdk.buildTx(args);
  }

  @Post('submit_tx')
  async submitTx(@Body() args: SubmitTxArgsDto): Promise<SubmitResultDto> {
    return await this.sdk.submitTx(args);
  }
}
