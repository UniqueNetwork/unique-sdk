import { SignerPayloadJSON } from '@polkadot/types/types/extrinsic';
import { HexString } from '@polkadot/util/types';
import { SignatureType, SignResult } from './polkadot-types';

export interface SdkSigner {
  sign(payload: string): Promise<SignResult>;
}

export interface SubmitResult {
  hash: HexString;
}

export interface SignTxArgs {
  signerPayloadHex: HexString;
}

export interface SignTxResult extends SignResult {
  signature: HexString;
  signatureType: SignatureType;
}

export interface SubmitTxArgs {
  signerPayloadJSON: SignerPayloadJSON;
  signature: HexString;
  signatureType: SignatureType | `${SignatureType}`;
}

export interface TxBuildArgs {
  address: string;
  section: string;
  method: string;
  args: Array<string | number | BigInt | Record<string, any>>; // todo Oo ArgType? see packages/sdk/src/lib/types/index.ts line 31
  era?: number;
  isImmortal?: boolean;
}
