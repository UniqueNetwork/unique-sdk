import { HexString } from '@polkadot/util/types';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
  ISubmittableResult,
} from '@polkadot/types/types/extrinsic';

import { AnyObject } from './unique-types';
import {
  SignTxArguments,
  SignTxResult,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
} from './arguments';
import { SignResult } from './polkadot-types';

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

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}

export interface ISdkExtrinsics {
  build(buildArgs: TxBuildArguments): Promise<UnsignedTxPayload>;

  sign(
    args: SignTxArguments,
    signer: SdkSigner | undefined,
  ): Promise<SignTxResult>;

  submit(
    args: SubmitTxArguments,
    isObservable?: boolean,
  ): Promise<SubmitResult>;

  submitWaitCompleted(args: SubmitTxArguments): Promise<ISubmittableResult>;
}

export interface SdkSigner {
  sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult>;
}
