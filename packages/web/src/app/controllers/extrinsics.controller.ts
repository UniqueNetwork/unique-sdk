import {
  Body,
  Controller,
  Post,
  UseFilters,
  Injectable,
  Scope,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  SignTxArgs,
  SignTxResult,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
  UnsignedTxPayload,
} from '@unique-nft/sdk/extrinsics';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
@Injectable({ scope: Scope.REQUEST })
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildArgs): Promise<UnsignedTxPayload> {
    return this.sdk.extrinsics.build(args);
  }

  @Post('sign')
  async sign(@Body() args: SignTxArgs): Promise<SignTxResult> {
    if (args.signer) {
      return this.sdk.extrinsics.sign(args, args.signer);
    }
    return this.sdk.extrinsics.sign(args);
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
