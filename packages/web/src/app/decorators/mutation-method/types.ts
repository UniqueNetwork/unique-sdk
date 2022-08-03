/* eslint-disable max-classes-per-file */

import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { HexString } from '@polkadot/util/types';
import { SubmitResult } from '@unique-nft/sdk/types';
import { Cache } from 'cache-manager';
import { Sdk } from '@unique-nft/sdk';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import { FeeResponse } from '../../types/sdk-methods';
import { SubmitTxBody } from '../../types/arguments';

const AnyToBoolean = Transform(({ obj = {}, key }) => {
  const asString = String(obj && obj[key]).toLowerCase();

  return asString === 'true' || asString === '1';
});

export interface MutationMethodOptions {
  mutationMethod: MutationMethodWrap<any, any>;
  cache: Cache;
  sdk: Sdk;
}

export enum MutationUse {
  Build = 'Build',
  Sign = 'Sign',
  Submit = 'Submit',
  SubmitWatch = 'SubmitWatch',
  Result = 'Result',
}

export class MutationMethodQuery {
  @AnyToBoolean
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    required: false,
    default: false,
  })
  withFee?: boolean;

  @IsOptional()
  @IsEnum(MutationUse)
  @ApiProperty({
    enum: MutationUse,
    example: MutationUse.Build,
    required: false,
  })
  use?: MutationUse;
}

export class SignResponse extends SubmitTxBody {
  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class SubmitResponse implements Omit<SubmitResult, 'result$'> {
  @ApiProperty({ type: String, required: true })
  hash: HexString;

  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class MutationResponse {
  @ApiProperty({ type: Boolean })
  isError: boolean;

  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}
