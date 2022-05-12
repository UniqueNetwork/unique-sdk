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

export interface ChainProperties {
  SS58Prefix: number;
  token: string;
  decimals: number;
  wsUrl: string;
}

export interface FromToArgs {
  from: string;
  to: string;
}

export interface Balance {
  amount: string;
  formatted: string;
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

export type CollectionIdArg = {
  collectionId: number;
};

export type TokenIdArg = CollectionIdArg & {
  tokenId: number;
};

export class AddressArg {
  @ValidAddress()
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

export type BurnCollectionArgs = CollectionIdArg & AddressArg;
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
