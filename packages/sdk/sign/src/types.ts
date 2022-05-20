// eslint-disable-next-line max-classes-per-file
import 'reflect-metadata';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ValidSeed, ValidUri } from '@unique-nft/sdk/validation';
import { IsNotEmptyObject, IsEnum, IsOptional } from 'class-validator';

export type SignerOptions =
  | SeedSignerOptions
  | UriSignerOptions
  | KeyfileSignerOptions
  | PolkadotSignerOptions;

export enum SignType {
  ed25519 = 'ed25519',
  sr25519 = 'sr25519',
  ecdsa = 'ecdsa',
  ethereum = 'ethereum',
}

export class SeedSignerOptions {
  @ValidSeed()
  seed: string;

  @IsEnum(SignType)
  @IsOptional()
  type?: SignType;

  constructor(seed: string) {
    this.seed = seed;
  }
}

export class UriSignerOptions {
  @ValidUri()
  uri: string;

  @IsEnum(SignType)
  @IsOptional()
  type?: SignType;

  constructor(uri: string) {
    this.uri = uri;
  }
}

export class KeyfileSignerOptions {
  @IsNotEmptyObject()
  keyfile: KeyringPair$Json;

  passwordCallback: () => Promise<string>;

  @IsEnum(SignType)
  @IsOptional()
  type?: SignType;
}

export class PolkadotSignerOptions {
  choosePolkadotAccount: (
    accounts: InjectedAccountWithMeta[],
  ) => Promise<InjectedAccountWithMeta>;
}
