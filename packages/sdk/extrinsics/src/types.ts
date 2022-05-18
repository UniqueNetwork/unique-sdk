// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { HexString } from '@polkadot/util/types';
import {
  IsEnum,
  IsHexadecimal,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import {
  SignatureType,
  SignerPayloadJSONDto,
  SignerPayloadRawDto,
} from './polkadot-types';

export interface ISdkExtrinsics {
  build(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload>;
  sign(args: SignTxArgs, signer: SdkSigner | undefined): Promise<SignTxResult>;
  submit(args: SubmitTxArgs): Promise<SubmitResult>;
}

export interface SdkSigner {
  sign(payload: string): Promise<HexString>;
}

export class SubmitResult {
  @ApiProperty({ type: String })
  hash: HexString;
}

export class SignTxArgs {
  @ApiProperty({ type: String })
  signerPayloadHex: HexString;

  signer?: SdkSigner;
}

export class SignTxResult {
  @ApiProperty({ type: String })
  signature: HexString;
}

export class SubmitTxArgs {
  @IsNotEmptyObject()
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @IsHexadecimal()
  @ApiProperty({ type: String })
  signature: HexString;

  @IsOptional()
  @IsEnum(SignatureType)
  @ApiProperty({
    enum: SignatureType,
    required: false,
  })
  signatureType?: SignatureType | `${SignatureType}`;
}

export class TxBuildArgs {
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
   * todo required? why?
   */
  @ApiProperty({
    required: false,
    example: 64,
  })
  era?: number;

  /**
   * todo required? why?
   */
  @ApiProperty({
    required: false,
    example: false,
  })
  isImmortal?: boolean;
}

export class UnsignedTxPayload {
  @ApiProperty()
  signerPayloadJSON: SignerPayloadJSONDto;

  @ApiProperty()
  signerPayloadRaw: SignerPayloadRawDto;

  @ApiProperty({ type: String })
  signerPayloadHex: HexString;
}
