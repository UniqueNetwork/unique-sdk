import { Header, Index } from '@polkadot/types/interfaces';

export { HexString } from '@polkadot/util/types';
export { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
export { AnyJson } from '@polkadot/types/types';

export interface SingingInfo {
  header: Header | null;
  mortalLength: number;
  nonce: Index;
}

export enum SignatureType {
  Sr25519 = 'sr25519',
  Ed25519 = 'ed25519',
  Ecdsa = 'ecdsa',
  Ethereum = 'ethereum',
}
