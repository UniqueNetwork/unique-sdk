import { Body, Controller, Post, UseFilters } from '@nestjs/common';

import { Sdk } from '@unique-nft/sdk';
import { ApiTags } from '@nestjs/swagger';
import {
  ExtrinsicBuildResponse,
  ExtrinsicBuildRequest,
  ExtrinsicSubmitRequest,
  ExtrinsicSubmitResponse,
} from '../dto';
import { SdkExceptionsFilter } from '../utils/exception-filter';

@UseFilters(SdkExceptionsFilter)
@ApiTags('extrinsic')
@Controller('extrinsic')
export class ExtrinsicsController {
  constructor(private readonly sdk: Sdk) {}

  @Post('build')
  async buildTx(
    @Body() args: ExtrinsicBuildRequest,
  ): Promise<ExtrinsicBuildResponse> {
    return this.sdk.buildTx(args);
  }

  @Post('submit')
  async submitTx(
    @Body() args: ExtrinsicSubmitRequest,
  ): Promise<ExtrinsicSubmitResponse> {
    return this.sdk.submitTx(args);
  }
}
