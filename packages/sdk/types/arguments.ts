import {
  ISubmittableResult,
  SignerPayloadJSON,
} from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { Observable } from 'rxjs';
import { SignatureType, SignResult } from './polkadot-types';

export interface SubmitResult {
  hash: HexString;
  result$: Observable<ISubmittableResult>;
}

export interface ObservableSubmitResult<R> {
  hash: HexString;
  result$: Observable<SubmittableResultInProcess<R>>;
}

export interface SignTxArguments {
  signerPayloadHex: HexString;
}

export interface SignTxResult extends SignResult {
  signature: HexString;
  signatureType: SignatureType;
}

export interface SubmitTxArguments {
  signerPayloadJSON: SignerPayloadJSON;
  signature: HexString;
}

export interface TxBuildArguments {
  address: Address;
  section: string;
  method: string;
  args: Array<string | number | BigInt | Record<string, any>>; // todo Oo ArgType? see packages/sdk/src/lib/types/index.ts line 31
  era?: number;
  isImmortal?: boolean;
}

export interface ApiRequestArguments {
  endpoint: string;
  module: string;
  method: string;
}

export interface ApiMethodArguments extends ApiRequestArguments {
  args: Array<string | number | BigInt | Record<string, any>>;
}

export type ApiGetterArguments = ApiRequestArguments;

export interface SubmittableDispatchError {
  message: string;
  details?: unknown;
}
export interface SubmittableResultInProcess<T> {
  submittableResult: ISubmittableResult;
  parsed?: T;
  error?: SubmittableDispatchError;
}

export interface SubmittableResultCompleted<T> {
  submittableResult: ISubmittableResult;
  isCompleted: true;
  parsed: T;
}

export type Address = string;

export type CrossAccountId = { Substrate: string } | { Ethereum: string };
