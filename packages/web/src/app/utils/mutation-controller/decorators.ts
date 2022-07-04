/* eslint-disable max-classes-per-file */

import { applyDecorators, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { UnsignedTxPayloadResponseWithFee } from '../../types/sdk-methods';
import { SignTxResultResponse } from '../../types/arguments';
import { Action, ActionResult, GetResult, Status } from './types';

type MethodDecorators = {
  Build: MethodDecorator;
  Sign: MethodDecorator;
  Submit: MethodDecorator;
  Result: MethodDecorator;
};

export class GetResultQuery implements GetResult {
  @ApiProperty()
  submissionId: string;
}

export class ActionQuery implements ActionResult {
  @ApiProperty()
  action: Action;
}

const authTokenDescription = `Use the Authorization request header to provide authentication information
<ul>
<li><code>Authorization: Seed &lt;your mnemonic phrase | uri name&gt;</code></li>
</ul>`;

export const getMethodDecorators = (
  methodName: string,
  inputDto,
  outputDto,
): MethodDecorators => {
  class ResultOrErrorDto {
    @ApiProperty()
    status: Status;

    @ApiProperty({ type: outputDto })
    result?: typeof outputDto;

    @ApiProperty()
    error?: Error;
  }

  const Build = applyDecorators(
    Post(`${methodName}/build`),
    ApiBody({ type: inputDto }),
    ApiResponse({ type: UnsignedTxPayloadResponseWithFee }),
  );

  const Sign = applyDecorators(
    Post(`${methodName}/sign`),
    ApiOperation({ description: authTokenDescription }),
    ApiBearerAuth('SeedAuth'),
    ApiResponse({ type: SignTxResultResponse }),
  );

  const Submit = applyDecorators(
    Post(`${methodName}/submit`),
    ApiOperation({ description: authTokenDescription }),
    ApiBearerAuth('SeedAuth'),
    ApiResponse({ type: GetResultQuery }),
  );

  const Result = applyDecorators(
    Get(`${methodName}/result`),
    ApiResponse({ type: ResultOrErrorDto }),
  );

  return {
    Build,
    Sign,
    Submit,
    Result,
  };
};
