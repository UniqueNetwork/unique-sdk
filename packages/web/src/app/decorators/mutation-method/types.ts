/* eslint-disable max-classes-per-file */

import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Type } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { HexString } from '@polkadot/util/types';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';
import { SubmitResult } from '@unique-nft/sdk/types';
import { FeeResponse } from '../../types/sdk-methods';
import { SubmitTxBody } from '../../types/arguments';

export type DtoFor<T> = { new (...args: any[]): T };

const AnyToBoolean = Transform(({ obj = {}, key }) => {
  const asString = String(obj && obj[key]).toLowerCase();

  return asString === 'true' || asString === '1';
});

export type ControllerOptions<A, R> = {
  sectionPath: string;
  tag?: string;
  methodPath?: string;
  MutationConstructor: Type<MutationMethodWrap<A, R>>;
  inputDto: DtoFor<A>;
  outputDto: DtoFor<R>;
};

export enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

export type ResultOrError<T> = {
  status: Status;
  result?: T;
  error?: Error;
};

export interface GetResult {
  submissionId: string;
}

export enum Action {
  build = 'build',
  sign = 'sign',
  submit = 'submit',
}

export interface ActionResult {
  action: Action;
}

export enum MutationUse {
  Build = 'Build',
  Sign = 'Sign',
  Submit = 'Submit',
  Result = 'Result',
}

export class MutationOptions {
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

export class SignResultResponse extends SubmitTxBody {
  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class SubmitResultResponse implements Omit<SubmitResult, 'result$'> {
  @ApiProperty({ type: String, required: true })
  hash: HexString;

  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class MutationResultResponse {
  @ApiProperty({ type: Boolean })
  isCompleted: boolean;

  @ApiProperty({ type: FeeResponse, required: false })
  fee?: FeeResponse;
}

export class BalanceTransferResultResponse extends MutationResultResponse {
  @ApiProperty({
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
      },
    },
  })
  parsed: {
    success: boolean;
  };

  @ApiProperty({ type: FeeResponse })
  fee?: FeeResponse;
}
