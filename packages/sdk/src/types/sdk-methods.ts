// eslint-disable-next-line max-classes-per-file
import { IsString, IsNumber, IsPositive, NotEquals } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  SignTxArgs,
  SignTxResult,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
  UnsignedTxPayload,
} from '@unique-nft/sdk/extrinsics';
import { HexString } from '@polkadot/util/types';
import { NotYourselfAddress, ValidAddress } from '@unique-nft/sdk/validation';
import { CollectionInfo, CollectionInfoBase, TokenInfo } from './unique-types';

export class ChainProperties {
  @ApiProperty({
    example: 255,
  })
  SS58Prefix: number;

  @ApiProperty({
    example: 'QTZ',
  })
  token: string;

  @ApiProperty({
    example: 18,
  })
  decimals: number;

  @ApiProperty({
    example: 'wss://ws-quartz.unique.network',
  })
  wsUrl: string;

  @ApiProperty({
    example:
      '0xe9fa5b65a927e85627d87572161f0d86ef65d1432152d59b7a679fb6c7fd3b39',
  })
  genesisHash: HexString;
}

export class Balance {
  @ApiProperty({
    example: '411348197000000000000',
  })
  amount: string;

  @ApiProperty({
    example: '411.3481 QTZ',
  })
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export class TransferBuildArgs {
  @IsString()
  @ValidAddress()
  @NotYourselfAddress('destination')
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;

  @ValidAddress()
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  destination: string;

  @IsNumber()
  @IsPositive()
  @NotEquals(0)
  @ApiProperty({
    example: 0.01,
  })
  amount: number;
}

export class CollectionIdArg {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;
}

export class TokenIdArg extends CollectionIdArg {
  @ApiProperty({
    example: 1,
  })
  tokenId: number;
}

export class AddressArg {
  @ValidAddress()
  @ApiProperty()
  address: string;
}

export class CreateCollectionArgs extends CollectionInfoBase {
  @ApiProperty({
    description: 'The ss-58 encoded address',
    example: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
  })
  address: string;
}

export class BurnCollectionArgs {
  @ApiProperty({
    example: 1,
  })
  collectionId: number;

  @ValidAddress()
  @ApiProperty()
  address: string;
}
export class TransferCollectionArgs {
  @ApiProperty()
  collectionId: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;
}

export class CreateTokenArgs {
  @ApiProperty()
  collectionId: number;

  @ValidAddress()
  @ApiProperty()
  address: string;

  @ApiProperty()
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  constData: Record<string, any>;
}

export class BurnTokenArgs extends TokenIdArg {
  @ValidAddress()
  @ApiProperty()
  address: string;
}
export class TransferTokenArgs extends TokenIdArg {
  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;
}

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
  sign(signArgs: SignTxArgs): SignTxResult;
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
