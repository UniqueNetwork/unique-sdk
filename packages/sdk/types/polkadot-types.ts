import { HexString } from '@polkadot/util/types';

export enum SignatureType {
  Sr25519 = 'sr25519',
  Ed25519 = 'ed25519',
  Ecdsa = 'ecdsa',
  Ethereum = 'ethereum',
}

export interface SignResult {
  signatureType: SignatureType;
  signature: HexString;
}

export { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
export { AnyJson, ISubmittableResult } from '@polkadot/types/types';
export { HexString } from '@polkadot/util/types';
