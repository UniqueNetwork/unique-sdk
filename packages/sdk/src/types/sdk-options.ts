// eslint-disable-next-line max-classes-per-file
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
  keyfile: string;

  passwordCallback: () => string;
}
