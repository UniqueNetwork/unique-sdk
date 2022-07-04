// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';

import { SignResult, SignatureType } from '../src/types';

export type SignerOptions = SeedSignerOptions | KeyfileSignerOptions;

export interface SeedSignerOptions {
  seed: string;
  type?: SignatureType;
}

export interface KeyfileSignerOptions {
  keyfile: KeyringPair$Json;
  passwordCallback: () => Promise<string>;
  type?: SignatureType;
}

export interface PolkadotSignerOptions {
  chooseAccount?: (accounts: any[]) => Promise<any>;
}

export { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
export { AnyJson, ISubmittableResult } from '@polkadot/types/types';
export { HexString } from '@polkadot/util/types';

export interface SdkSigner {
  sign(unsignedTxPayload: UnsignedTxPayload): Promise<SignResult>;
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSON;
  signerPayloadRaw: SignerPayloadRaw;
  signerPayloadHex: HexString;
}
