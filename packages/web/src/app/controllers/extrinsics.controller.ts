import { Body, Controller, Post, UseFilters, Headers } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SdkSigner } from '@unique-nft/sdk/types';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { SignHeaders, VerificationResult } from '../types/requests';
import { Signer } from '../decorators/signer.decorator';
import { validate } from '../validation';
import { UnsignedTxPayloadDto } from '../types/sdk-methods';
import {
  SignTxArgsDto,
  SignTxResultDto,
  SubmitResultDto,
  SubmitTxArgsDto,
  TxBuildArgsDto,
} from '../types/arguments';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildArgsDto): Promise<UnsignedTxPayloadDto> {
    return this.sdk.extrinsics.build(args);
  }

  @Post('sign')
  @ApiBearerAuth('SeedAuth')
  async sign(
    @Body() args: SignTxArgsDto,
    @Headers() headers: SignHeaders,
    @Signer() signer?: SdkSigner,
  ): Promise<SignTxResultDto> {
    return this.sdk.extrinsics.sign(args, signer);
  }

  @Post('verify-sign')
  async verifySign(@Body() args: SubmitTxArgsDto): Promise<VerificationResult> {
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
  async submitTx(@Body() args: SubmitTxArgsDto): Promise<SubmitResultDto> {
    await validate(args, SubmitTxArgsDto);
    return this.sdk.extrinsics.submit(args);
  }
}
