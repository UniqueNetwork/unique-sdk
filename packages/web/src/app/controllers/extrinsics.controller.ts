import {
  Body,
  Controller,
  Post,
  UseFilters,
  Headers,
  UsePipes,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SdkSigner, UnsignedTxPayload } from '@unique-nft/sdk/types';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { SignHeaders, VerificationResultResponse } from '../types/requests';
import { Signer } from '../decorators/signer.decorator';
import { SdkValidationPipe } from '../validation';
import {
  UnsignedTxPayloadBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';
import {
  SignTxResultResponse,
  SubmitResultResponse,
  SubmitTxBody,
  TxBuildBody,
} from '../types/arguments';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildBody): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.extrinsics.build(args);
  }

  @Post('sign')
  @ApiBearerAuth('SeedAuth')
  async sign(
    @Body() args: UnsignedTxPayloadBody,
    @Headers() headers: SignHeaders,
    @Signer() signer?: SdkSigner,
  ): Promise<SignTxResultResponse> {
    return this.sdk.extrinsics.sign(args, signer);
  }

  @Post('verify-sign')
  async verifySign(
    @Body() args: SubmitTxBody,
  ): Promise<VerificationResultResponse> {
    try {
      await this.sdk.extrinsics.verifySignOrThrow(args);

      return { isValid: true, errorMessage: null };
    } catch (e) {
      return {
        isValid: false,
        errorMessage: e.toString(),
      };
    }
  }

  @Post('submit')
  @UsePipes(new SdkValidationPipe({}))
  async submitTx(@Body() args: SubmitTxBody): Promise<SubmitResultResponse> {
    return this.sdk.extrinsics.submit(args);
  }
}
