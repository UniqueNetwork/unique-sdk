// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
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

export interface GenerateAccountArguments {
  pairType?: SignatureType;
  meta?: KeyringPair$Meta;
}
export interface GetAccountArguments extends GenerateAccountArguments {
  mnemonic: string;
}

export interface Account {
  mnemonic: string;

  seed: HexString;

  publicKey: HexString;

  keyfile: KeyringPair$Json;
}
