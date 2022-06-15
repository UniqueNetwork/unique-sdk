import {
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
  Get,
  Query,
  Inject,
  CACHE_MANAGER,
  NotFoundException,
} from '@nestjs/common';
import { map, catchError } from 'rxjs';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SdkSigner } from '@unique-nft/sdk/types';
import { Cache } from 'cache-manager';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { VerificationResultResponse } from '../types/requests';
import { Signer } from '../decorators/signer.decorator';
import { SdkValidationPipe } from '../validation';
import {
  FeeResponse,
  UnsignedTxPayloadBody,
  UnsignedTxPayloadResponse,
} from '../types/sdk-methods';
import {
  ExtrinsicResultRequest,
  SignTxResultResponse,
  SubmitResultResponse,
  SubmitTxBody,
  TxBuildBody,
} from '../types/arguments';
import { ExtrinsicResultResponse } from '../types/extrinsic-result-response';
import { serializeResult } from '../utils/submittable-result-transformer';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(
    private readonly sdk: Sdk,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Post('build')
  async buildTx(@Body() args: TxBuildBody): Promise<UnsignedTxPayloadResponse> {
    return this.sdk.extrinsics.build(args);
  }

  @ApiOperation({
    description: `Use the Authorization request header to provide authentication information
<ul>
<li><code>Authorization: Seed &lt;your mnemonic phrase | uri name&gt;</code></li>
</ul>`,
  })
  @Post('sign')
  @ApiBearerAuth('SeedAuth')
  async sign(
    @Body() args: UnsignedTxPayloadBody,
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
  async submitTx(@Body() args: SubmitTxBody): Promise<SubmitResultResponse> {
    const { hash, result$ } = await this.sdk.extrinsics.submit(args, true);

    const updateCache = async (next: ISubmittableResult): Promise<void> => {
      await this.cache.set(hash, serializeResult(this.sdk.api, next));
    };

    result$.pipe(map(updateCache), catchError(updateCache));

    await this.cache.set<ExtrinsicResultResponse>(hash, {
      events: [],
      isCompleted: false,
      isError: false,
      status: 'pending',
    });

    return { hash };
  }

  @Post('calculate-fee')
  async calculateFee(@Body() args: TxBuildBody): Promise<FeeResponse> {
    return this.sdk.extrinsics.getFee(args);
  }

  @Get('status')
  async getStatus(
    @Query() { hash }: ExtrinsicResultRequest,
  ): Promise<ExtrinsicResultResponse> {
    const result = await this.cache.get<ExtrinsicResultResponse>(hash);

    if (result) return result;

    throw new NotFoundException(
      `No extrinsic with hash ${hash} found in cache`,
    );
  }
}
