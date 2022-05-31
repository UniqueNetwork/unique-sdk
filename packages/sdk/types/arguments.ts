import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { SignatureType, SignResult } from './polkadot-types';

export interface SubmitResult {
  hash: HexString;
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
  address: string;
  section: string;
  method: string;
  args: Array<string | number | BigInt | Record<string, any>>; // todo Oo ArgType? see packages/sdk/src/lib/types/index.ts line 31
  era?: number;
  isImmortal?: boolean;
}

export enum QueryController {
  rpc = 'rpc',
  derive = 'derive',
  chain = 'chain',
}

export interface QueryArguments {
  controller: QueryController;
  section: string;
  method: string;
  args: Array<string | number | BigInt | Record<string, any>>;
}
