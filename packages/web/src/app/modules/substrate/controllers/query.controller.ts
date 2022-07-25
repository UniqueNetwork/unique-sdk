import {
  Param,
  Body,
  Get,
  Controller,
  Post,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Sdk } from '@unique-nft/sdk';
import { SdkExceptionsFilter } from '../../../utils/exception-filter';
import {
  ApiGetterParams,
  ApiRequestBody,
  ApiRequestParams,
} from '../../../types/arguments';
import { SdkValidationPipe } from '../../../validation';

@UsePipes(SdkValidationPipe)
@UseFilters(SdkExceptionsFilter)
@ApiTags('query')
@Controller('query')
export class QueryController {
  constructor(private readonly sdk: Sdk) {}

  @Get('/:endpoint/:module/:method')
  @ApiOperation({
    summary: 'Direct get to any Polkadot getter',
    description: `For read Polkadot <a href="https://polkadot.js.org/docs/substrate/constants">constants</a>
select the appropriate value from the interface <code>api.&lt;endpoint&gt;.&lt;module&gt;.&lt;method&gt;</code>.`,
  })
  async get(@Param() params: ApiGetterParams): Promise<any> {
    return this.sdk.stateQueries.get({ ...params });
  }

  @Post('/:endpoint/:module/:method')
  @ApiOperation({
    summary: 'Direct call to any Polkadot method',
    description: `For call Polkadot method <a href="https://polkadot.js.org/docs/substrate/storage/#number-u32">The current block number being processed</a>
\t<ul><li><code>number(): u32<FrameSystemPhase></code></li>
\t<li><code>interface: api.query.system.number</code></li></ul>
select the appropriate value from the interface <code>api.&lt;endpoint&gt;.&lt;module&gt;.&lt;method&gt;</code>
and pass the parameters to the method in the args list.`,
  })
  async query(
    @Param() params: ApiRequestParams,
    @Body() args: ApiRequestBody,
  ): Promise<any> {
    return this.sdk.stateQueries.execute({ ...params, ...args });
  }
}
