import { HexString } from '@polkadot/util/types';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
  ISubmittableResult,
} from '@polkadot/types/types/extrinsic';
import { AnyObject } from './unique-types';
import {
  CollectionIdArguments,
  SignTxArguments,
  SignTxResult,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
  TxBuildOptions,
} from './arguments';
import { SignResult } from './polkadot-types';
import { Sdk } from '@unique-nft/sdk';

export interface SdkReadableMethod<A, R> {
  (
    this: Sdk,
    args: A,
  ): Promise<R>;
}

export interface SdkWritableMethod<A> {
  (
    this: Sdk,
    args: A,
    buildExtrinsicOptions?: TxBuildOptions,
  ): Promise<UnsignedTxPayload>;
}

export interface ChainProperties {
  SS58Prefix: number;
  token: string;
  decimals: number;
  wsUrl: string;
  genesisHash: HexString;
}

export interface Balance {
  raw: string;
  amount: number;
  amountWithUnit: string;
  formatted: string;
  unit: string;
}

export type Fee = Balance;

export interface TransferBuildArguments {
  address: string;
  destination: string;
  amount: number;
}

export interface TokenIdArguments extends CollectionIdArguments {
  tokenId: number;
}

export interface AddressArguments {
  address: string;
}

export interface BurnCollectionArguments {
  collectionId: number;
  address: string;
}
export interface TransferCollectionArguments {
  collectionId: number;
  from: string;
  to: string;
}

export interface CreateTokenArguments extends AddressArguments {
  // todo - rename "address" field to "author" or "creator" ?
  collectionId: number;
  owner?: string;
  constData: AnyObject;
}

export interface BurnTokenArguments extends TokenIdArguments {
  address: string;
}
export interface TransferTokenArguments extends TokenIdArguments {
  from: string;
  to: string;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export type ExtrinsicResultCallback = (
  result: ISubmittableResult,
) => void | Promise<void>;

export interface ISdkExtrinsics {
  build(buildArgs: TxBuildArguments): Promise<UnsignedTxPayload>;
  sign(
    args: SignTxArguments,
    signer: SdkSigner | undefined,
  ): Promise<SignTxResult>;
  submit(
    args: SubmitTxArguments,
    callback?: ExtrinsicResultCallback,
  ): Promise<SubmitResult>;
}

export interface SdkSigner {
  sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult>;
}
