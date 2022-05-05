import { HexString } from '@polkadot/util/types';
import { AugmentedSubmittables } from '@polkadot/api-base/types/submittable';
import { CollectionInfo, TokenInfo } from './unique-types';
import {
  SignatureType,
  SignerPayloadJSON,
  SignerPayloadRaw,
} from './polkadot-types';

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

export interface TransferBuildArgs {
  address: string;
  destination: string;
  amount: number;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export interface SubmitTxArgs {
  signerPayloadJSON: SignerPayloadJSON;
  signature: HexString;
  signatureType?: SignatureType;
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

export type AddressArg = {
  address: string;
};

export type CreateCollectionArgs = Partial<
  Omit<CollectionInfo, 'id' | 'owner'>
> &
  AddressArg;

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
