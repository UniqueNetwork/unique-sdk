import { SdkSigner } from './sdk-methods';

export interface SdkOptions {
  chainWsUrl: string;
  signer?: SdkSigner;
}
