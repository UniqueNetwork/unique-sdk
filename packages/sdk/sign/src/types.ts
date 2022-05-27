// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { SignatureType } from '@unique-nft/sdk/types';

export type SignerOptions =
  | SeedSignerOptions
  | KeyfileSignerOptions
  | PolkadotSignerOptions;

export interface SeedSignerOptions {
  seed: string;
  type?: SignatureType;
}

export interface KeyfileSignerOptions {
  keyfile: KeyringPair$Json;
  passwordCallback: () => Promise<string>;
  type?: SignatureType;
}

export interface PolkadotExtensionDApp {
  web3Accounts: () => Promise<any[]>;
  web3Enable: (appName: string) => Promise<any[]>;
  web3FromSource: (data: any) => any;
  isWeb3Injected: boolean;
}

export interface PolkadotSignerOptions {
  extensionDApp: PolkadotExtensionDApp;
  choosePolkadotAccount: (accounts: any[]) => Promise<any>;
}

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
