import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Sdk } from '@unique-nft/sdk';
import { SdkExceptionsFilter } from '../utils/exception-filter';
import { ApiQueryBody } from '../types/arguments';
import { validate } from '../validation';

@UseFilters(SdkExceptionsFilter)
@ApiTags('query')
@Controller('query')
export class QueryController {
  constructor(private readonly sdk: Sdk) {}

  @Post()
  async query(@Body() args: ApiQueryBody): Promise<any> {
    await validate(args, ApiQueryBody);
    return this.sdk.stateQueries.execute(args);
  }
}
