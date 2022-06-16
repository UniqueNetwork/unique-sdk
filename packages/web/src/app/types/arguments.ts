/* eslint-disable max-classes-per-file */
import { HexString } from '@polkadot/util/types';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import {
  IsHexadecimal,
  IsNotEmptyObject,
  IsString,
  IsArray,
} from 'class-validator';
import {
  SignatureType,
  SignTxResult,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
  ApiQueryArguments,
} from '@unique-nft/sdk/types';
import { SignerPayloadJSONDto } from './signer-payload';

export class SubmitResultResponse implements SubmitResult {
  @ApiProperty({ type: String })
  hash: HexString;
}

export class ExtrinsicResultRequest extends SubmitResultResponse {}

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
  @ApiProperty({
    type: String,
    description: 'Warning: Signature must be with SignatureType!',
  })
  signature: HexString;
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

export class ApiRequestParams
  implements Pick<ApiQueryArguments, 'endpoint' | 'module' | 'method'>
{
  @ApiProperty({
    type: String,
    example: 'query',
  })
  @IsString()
  endpoint: string;

  @ApiProperty({
    type: String,
    example: 'system',
  })
  @IsString()
  module: string;

  @ApiProperty({
    type: String,
    example: 'number',
  })
  @IsString()
  method: string;
}

export class ApiRequestBody implements Pick<ApiQueryArguments, 'args'> {
  @ApiProperty({
    type: Array,
    example: '[]',
  })
  @IsArray()
  args: Array<string | number | BigInt | Record<string, any>>;
}
