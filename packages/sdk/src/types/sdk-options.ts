// eslint-disable-next-line max-classes-per-file
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { ValidSeed } from '@unique-nft/sdk/validation';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SignerOptions;
}

export type SignerOptions = SeedSignerOptions | KeyfileSignerOptions;

export class SeedSignerOptions {
  @ValidSeed()
  seed: string;

  developmentAccount?: boolean;
}

export class KeyfileSignerOptions {
  keyfile: KeyringPair$Json;

  passwordCallback: () => string;
}
