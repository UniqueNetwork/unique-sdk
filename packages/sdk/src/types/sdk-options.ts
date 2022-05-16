// eslint-disable-next-line max-classes-per-file
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { ValidSeed, ValidUri } from '@unique-nft/sdk/validation';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SignerOptions;
}

export type SignerOptions =
  | SeedSignerOptions
  | UriSignerOptions
  | KeyfileSignerOptions;

export class SeedSignerOptions {
  @ValidSeed()
  seed: string;
}

export class UriSignerOptions {
  @ValidUri()
  uri: string;
}

export class KeyfileSignerOptions {
  keyfile: KeyringPair$Json;

  passwordCallback: () => string;
}
