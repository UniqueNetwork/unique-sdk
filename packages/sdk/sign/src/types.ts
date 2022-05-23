// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { ValidSeed } from '@unique-nft/sdk/validation';
import {
  IsNotEmptyObject,
  IsEnum,
  IsOptional,
  IsDefined,
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
