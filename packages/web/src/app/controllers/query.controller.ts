import { Body, Controller, Post, UseFilters, UsePipes } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Sdk } from '@unique-nft/sdk';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiQueryBody } from '../types/arguments';
import { SdkValidationPipe } from '../validation';

@UseFilters(SdkExceptionsFilter)
@ApiTags('query')
@Controller('query')
export class QueryController {
  constructor(private readonly sdk: Sdk) {}

  @Post()
  @UsePipes(new SdkValidationPipe({}))
  async query(@Body() args: ApiQueryBody): Promise<any> {
    return this.sdk.stateQueries.execute(args);
  }
}
