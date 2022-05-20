import { SdkSigner } from './arguments';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SdkSigner;
}
