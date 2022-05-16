import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import {
  Sdk,
} from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import { SubmitResult, SubmitTxArgs, TxBuildArgs, UnsignedTxPayload } from '@unique-nft/sdk/extrinsics';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build(args);
  }

  @Post('submit')
  async submitTx(@Body() args: SubmitTxArgs): Promise<SubmitResult> {
    return this.sdk.extrinsics.submit(args);
  }
}
