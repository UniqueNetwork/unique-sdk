export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SignerOptions;
}

export interface SignerOptions {
  type: SignerType;

  seed?: string;

  jsonFile?: string;
  passwordCallback?: () => string;
}

export enum SignerType {
  SEED = 'seed',
}
