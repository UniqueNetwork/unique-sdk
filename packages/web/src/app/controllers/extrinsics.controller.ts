import { Body, Controller, Post, UseFilters, Headers } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  SdkSigner,
  SignTxArgs,
  SignTxResult,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { SignHeaders } from '../types/requests';
import { Signer } from '../decorators/signer.decorator';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build(args);
  }

  @Post('sign')
  async sign(
    @Body() args: SignTxArgs,
    @Headers() headers: SignHeaders,
    @Signer() signer?: SdkSigner,
  ): Promise<SignTxResult> {
    return this.sdk.extrinsics.sign(args, signer);
  }

  @Post('verify-sign')
  async verifySign(@Body() args: SubmitTxArgs): Promise<void> {
    await this.sdk.extrinsics.verifySign(args);
  }

  @Post('submit')
  async submitTx(@Body() args: SubmitTxArgs): Promise<SubmitResult> {
    return this.sdk.extrinsics.submit(args);
  }
}
