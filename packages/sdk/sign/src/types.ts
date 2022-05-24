// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Meta, KeyringPair$Json } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { ValidMnemonic, ValidSeed } from '@unique-nft/sdk/validation';
import {
  IsNotEmptyObject,
  IsEnum,
  IsOptional,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import { SignatureType } from '@unique-nft/sdk/types';

export type SignerOptions =
  | SeedSignerOptions
  | KeyfileSignerOptions
  | PolkadotSignerOptions;

export class SeedSignerOptions {
  @ValidSeed()
  seed: string;

  @IsEnum(SignatureType)
  @IsOptional()
  type?: SignatureType;

  constructor(seed: string) {
    this.seed = seed;
  }
}

export class KeyfileSignerOptions {
  @IsNotEmptyObject()
  keyfile: KeyringPair$Json;

  passwordCallback: () => Promise<string>;

  @IsEnum(SignatureType)
  @IsOptional()
  type?: SignatureType;
}

export class PolkadotExtensionDApp {
  @IsDefined()
  web3Accounts: () => Promise<any[]>;

  @IsDefined()
  web3Enable: (appName: string) => Promise<any[]>;

  @IsDefined()
  web3FromSource: (data: any) => any;

  @IsDefined()
  isWeb3Injected: boolean;
}

export class PolkadotSignerOptions {
  @IsDefined()
  extensionDApp: PolkadotExtensionDApp;

  @IsDefined()
  choosePolkadotAccount: (accounts: any[]) => Promise<any>;
}

export class GenerateAccountArgs {
  @IsOptional()
  password?: string;

  @IsEnum(SignatureType)
  @IsOptional()
  pairType?: SignatureType;

  @IsOptional()
  meta?: KeyringPair$Meta;
}
export class GetAccountArgs extends GenerateAccountArgs {
  @ValidMnemonic()
  mnemonic: string;
}

export interface Account {
  mnemonic: string;

  seed: HexString;

  publicKey: HexString;

  keyfile: KeyringPair$Json;
}
