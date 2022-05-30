import { SdkSigner } from './sdk-methods';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SdkSigner;
}
