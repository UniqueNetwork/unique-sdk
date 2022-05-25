import { HexString } from '@polkadot/util/types';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
} from '@polkadot/types/types/extrinsic';
import {
  AnyObject,
  CollectionInfo,
  CollectionInfoBase,
  TokenInfo,
} from './unique-types';
import {
  SdkSigner,
  SignTxArgs,
  SignTxResult,
  SubmitResult,
  SubmitTxArgs,
  TxBuildArgs,
} from './arguments';

export interface ChainProperties {
  SS58Prefix: number;
  token: string;
  decimals: number;
  wsUrl: string;
  genesisHash: HexString;
}

export interface Balance {
  amount: string;
  formatted: string;

  // todo see sdk.ts line 50
  // todo formatted: string
  // todo withUnit: string
}

export interface TransferBuildArgs {
  address: string;
  destination: string;
  amount: number;
}

export interface CollectionIdArg {
  collectionId: number;
}

export interface TokenIdArg extends CollectionIdArg {
  tokenId: number;
}

export interface AddressArg {
  address: string;
}

export interface CreateCollectionArgs extends CollectionInfoBase {
  address: string;
}

export interface BurnCollectionArgs {
  collectionId: number;
  address: string;
}
export interface TransferCollectionArgs {
  collectionId: number;
  from: string;
  to: string;
}

export interface CreateTokenArgs {
  collectionId: number;
  address: string;
  constData: AnyObject;
}

export interface BurnTokenArgs extends TokenIdArg {
  address: string;
}
export interface TransferTokenArgs extends TokenIdArg {
  from: string;
  to: string;
}

export interface ISdkCollection {
  get(args: CollectionIdArg): Promise<CollectionInfo | null>;
  create(collection: CreateCollectionArgs): Promise<UnsignedTxPayload>;
  burn(args: BurnCollectionArgs): Promise<UnsignedTxPayload>;
  transfer(args: TransferCollectionArgs): Promise<UnsignedTxPayload>;
}

export interface ISdkToken {
  get(args: TokenIdArg): Promise<TokenInfo | null>;
  create(token: CreateTokenArgs): Promise<UnsignedTxPayload>;
  burn(args: BurnTokenArgs): Promise<UnsignedTxPayload>;
  transfer(args: TransferTokenArgs): Promise<UnsignedTxPayload>;
}

export interface ISdkBalance {
  get(args: AddressArg): Promise<Balance>;
  transfer(buildArgs: TransferBuildArgs): Promise<UnsignedTxPayload>;
}

export interface ISdk {
  extrinsics: ISdkExtrinsics;
  balance: ISdkBalance;
  collection: ISdkCollection;
  token: ISdkToken;
  chainProperties(): ChainProperties;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export interface ISdkExtrinsics {
  build(buildArgs: TxBuildArgs): Promise<UnsignedTxPayload>;
  sign(args: SignTxArgs, signer: SdkSigner | undefined): Promise<SignTxResult>;
  submit(args: SubmitTxArgs): Promise<SubmitResult>;
}
