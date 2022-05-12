// eslint-disable-next-line max-classes-per-file
import { HexString } from '@polkadot/util/types';
import { AugmentedSubmittables } from '@polkadot/api-base/types/submittable';
import {
  IsString,
  IsNumber,
  IsPositive,
  NotEquals,
  IsNotEmptyObject,
  IsHexadecimal,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CollectionInfo, CollectionInfoBase, TokenInfo } from './unique-types';
import {
  SignatureType,
  SignerPayloadJSON,
  SignerPayloadRaw,
} from './polkadot-types';
import { NotYourselfAddress, ValidAddress } from '../utils/validator';

export class ChainProperties {
  /**
   * @example 255
   */
  @ApiProperty({
    example: 255,
  })
  SS58Prefix: number;

  /**
   * @example 'QTZ'
   */
  @ApiProperty()
  token: string;

  /**
   * @example 18
   */
  @ApiProperty()
  decimals: number;

  /**
   * @example 'wss://ws-quartz.unique.network'
   */
  @ApiProperty()
  wsUrl: string;
}

export interface FromToArgs {
  from: string;
  to: string;
}

export class Balance {
  /**
   * @example '411348197000000000000'
   */
  @ApiProperty()
  amount: string;

  /**
   * @example '411.3481 QTZ'
   */
  @ApiProperty()
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export interface TxBuildArgs {
  address: string;
  section: keyof AugmentedSubmittables<'promise'> | string; // todo section enum
  method: string; // todo method enum
  args: any[];
  era?: number;
  isImmortal?: boolean;
}

export class TransferBuildArgs {
  @IsString()
  @ValidAddress()
  @NotYourselfAddress('destination')
  address: string;

  @ValidAddress()
  destination: string;

  @IsNumber()
  @IsPositive()
  @NotEquals(0)
  amount: number;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export class SubmitTxArgs {
  @IsNotEmptyObject()
  signerPayloadJSON: SignerPayloadJSON;

  @IsHexadecimal()
  signature: HexString;

  @IsOptional()
  @IsEnum(SignatureType)
  signatureType?: SignatureType | `${SignatureType}`;
}

export interface SubmitResult {
  hash: HexString;
}

export class CollectionIdArg {
  /**
   * @example 1
   */
  @ApiProperty()
  collectionId: number;
}

export class TokenIdArg extends CollectionIdArg {
  /**
   * @example 1
   */
  @ApiProperty()
  tokenId: number;
}

export class AddressArg {
  @ValidAddress()
  @ApiProperty()
  address: string;
}

export class CreateCollectionArgs extends CollectionInfoBase {
  /**
   * @description The ss-58 encoded address
   * @example 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm'
   */
  @ApiProperty()
  address: string;
}

export class BurnCollectionArgs {
  /**
   * @example 1
   */
  @ApiProperty()
  collectionId: number;

  @ValidAddress()
  @ApiProperty()
  address: string;
}
export type TransferCollectionArgs = CollectionIdArg & FromToArgs;

export type CreateTokenArgs = CollectionIdArg &
  AddressArg & {
    constData: Record<string, any>;
  };
export type BurnTokenArgs = TokenIdArg & AddressArg;
export type TransferTokenArgs = TokenIdArg & FromToArgs;

export interface ISdkCollection {
  create(collection: CreateCollectionArgs): Promise<UnsignedTxPayload>;
  burn(args: BurnCollectionArgs): Promise<UnsignedTxPayload>;
  transfer(args: TransferCollectionArgs): Promise<UnsignedTxPayload>;
}

export interface ISdkToken {
  create(token: CreateTokenArgs): Promise<UnsignedTxPayload>;
  burn(args: BurnTokenArgs): Promise<UnsignedTxPayload>;
  transfer(args: TransferTokenArgs): Promise<UnsignedTxPayload>;
}

export interface ISdkExtrinsics {
  build(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload>;
  submit(args: SubmitTxArgs): Promise<SubmitResult>;
}

export interface ISdkBalance {
  buildTransfer(buildArgs: TransferBuildArgs): Promise<UnsignedTxPayload>;
}

export interface ISdkQuery {
  chainProperties(): ChainProperties;
  balance(args: AddressArg): Promise<Balance>;
  collection(args: CollectionIdArg): Promise<CollectionInfo | null>;
  token(args: TokenIdArg): Promise<TokenInfo | null>;
}

export interface ISdk {
  query: ISdkQuery;
  extrinsics: ISdkExtrinsics;
  balance: ISdkBalance;
  collection: ISdkCollection;
  token: ISdkToken;
}
