import {
  Body,
  Controller,
  Post,
  UseFilters,
  Headers,
  Query,
  Get,
} from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SdkSigner } from '@unique-nft/sdk/types';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { SignHeaders, VerificationResultResponse } from '../types/requests';
import { Signer } from '../decorators/signer.decorator';
import { validate } from '../validation';
import { UnsignedTxPayloadResponse } from '../types/sdk-methods';
import {
  ExtrinsicResultResponse,
  SignTxBody,
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
    @Body() args: SignTxBody,
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
  async submitTx(@Body() args: SubmitTxBody): Promise<ExtrinsicResultResponse> {
    await validate(args, SubmitTxBody);
    return this.sdk.extrinsics.submit(args);
  }

  @Get('status')
  async getStatus(
    @Query() args: SubmitResultResponse,
  ): Promise<ExtrinsicResultResponse> {
    return this.sdk.extrinsics.getStatus(args);
  }
}
