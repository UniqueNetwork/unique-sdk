// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { SignatureType } from '@unique-nft/sdk/types';

export interface GenerateAccountArguments {
  password?: string;
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
