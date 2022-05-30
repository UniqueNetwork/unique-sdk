/* eslint-disable max-classes-per-file */
import { HexString } from '@polkadot/util/types';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { IsEnum, IsHexadecimal, IsNotEmptyObject } from 'class-validator';
import {
  SignatureType,
  SignTxArguments,
  SignTxResult,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
} from '@unique-nft/sdk/types';
import { SignerPayloadJSONDto } from './signer-payload';
import {
  ExtrinsicResult,
  ExtrinsicStatusOrUnknown,
} from '@unique-nft/sdk/extrinsics/src/extrinsic-result-utils';
import { EventRecord } from '@polkadot/types/interfaces';

export class SubmitResultResponse implements SubmitResult {
  @ApiProperty({ type: String })
  hash: HexString;
}

export class ExtrinsicResultResponse implements ExtrinsicResult {
  @ApiProperty()
  extrinsicHash: string;

  @ApiProperty({ type: String, example: 'unknown' })
  extrinsicStatus: ExtrinsicStatusOrUnknown;

  @ApiProperty({ required: false })
  blockHash?: string;

  @ApiProperty({ required: false })
  blockNumber?: number;

  @ApiProperty({ required: false })
  extrinsicIndex?: number;

  @ApiProperty({ required: false })
  events?: EventRecord[];

  @ApiProperty()
  isSubscribed: boolean;

  @ApiProperty({ example: 'pending' })
  shortResult: 'pending' | 'success' | 'fail';
}

export class SignTxBody implements SignTxArguments {
  @ApiProperty({ type: String })
  signerPayloadHex: HexString;
}

export class SignTxResultResponse implements SignTxResult {
  @ApiProperty({ type: String })
  signature: HexString;

  @ApiProperty({ enum: SignatureType })
  signatureType: SignatureType;
}

export class SubmitTxBody implements SubmitTxArguments {
  @IsNotEmptyObject()
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @IsHexadecimal()
  @ApiProperty({ type: String })
  signature: HexString;

  @IsEnum(SignatureType)
  @ApiProperty({
    enum: SignatureType,
    required: false,
  })
  signatureType: SignatureType | `${SignatureType}`;
}

export class TxBuildBody implements TxBuildArguments {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  /**
   * todo enum? endpoint with enums? schema?
   */
  @ApiProperty({
    example: 'balances',
  })
  section: string;

  /**
   * todo enum? endpoint with enums? schema?
   */
  @ApiProperty({
    example: 'transfer',
  })
  method: string;

  @ApiProperty({
    example: ['yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK', 100000000],
    type: 'array',
    items: {
      type: 'array | number | Record<string, any>',
    },
  })
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  args: Array<string | number | BigInt | Record<string, any>>; // todo Oo ArgType? see packages/sdk/src/lib/types/index.ts line 31

  /**
   * todo - show this prop in schema, but hide from example
   */
  @ApiHideProperty()
  era?: number;

  /**
   * todo - show this prop in schema, but hide from example
   */
  @ApiHideProperty()
  isImmortal?: boolean;
}
