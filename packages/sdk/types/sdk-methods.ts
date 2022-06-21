import { HexString } from '@polkadot/util/types';
import {
  SignerPayloadJSON,
  SignerPayloadRaw,
  ISubmittableResult,
} from '@polkadot/types/types/extrinsic';
import { Observable } from 'rxjs';
import {
  SignTxArguments,
  SignTxResult,
  SubmitResult,
  SubmitTxArguments,
  TxBuildArguments,
} from './arguments';
import { SignResult } from './polkadot-types';

export interface SdkReadableMethod<A, R> {
  (args: A): Promise<R | null>;
}

export enum MutationCallMode {
  Build = 'Build',
  Sign = 'Sign',
  Submit = 'Submit',
  Watch = 'Watch',
  WaitCompleted = 'WaitCompleted',
}

export type SubmittableResultTransformed<T> = ISubmittableResult & {
  parsed?: T;
};

export type SubmittableResultCompleted<T> = ISubmittableResult & {
  parsed: T;
};

export interface SdkMutationMethod<A, R> {
  (args: A): Promise<UnsignedTxPayload>;

  (
    args: A,
    callMode: MutationCallMode.Build | 'Build',
  ): Promise<UnsignedTxPayload>;

  (args: A, callMode: MutationCallMode.Sign): Promise<SubmitTxArguments>;

  (args: A, callMode: MutationCallMode.Submit | 'Submit'): Promise<
    Omit<SubmitResult, 'result$'>
  >;

  (args: A, callMode: MutationCallMode.Watch | 'Watch'): Promise<
    Observable<SubmittableResultTransformed<R>>
  >;

  (
    args: A,
    callMode: MutationCallMode.WaitCompleted | 'WaitCompleted',
  ): Promise<SubmittableResultTransformed<R>>;
}

export interface MutationMethodWrap<A, R> {
  use: SdkMutationMethod<A, R>;

  getMethod(): SdkMutationMethod<A, R>;

  transformArgs(args: A): Promise<TxBuildArguments>;

  transformResult(result: ISubmittableResult): Promise<R | undefined>;
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

export interface AddressArguments {
  address: string;
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
