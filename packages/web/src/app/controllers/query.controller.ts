import {
  Param,
  Body,
  Controller,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Sdk } from '@unique-nft/sdk';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiRequestParams, ApiRequestBody } from '../types/arguments';
import { SdkValidationPipe } from '../validation';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('query')
@Controller('query')
export class QueryController {
  constructor(private readonly sdk: Sdk) {}

  @Post('/:endpoint/:module/:method')
  async query(
    @Param() params: ApiRequestParams,
    @Body() args: ApiRequestBody,
  ): Promise<any> {
    return this.sdk.stateQueries.execute({ ...params, ...args });
  }
}
