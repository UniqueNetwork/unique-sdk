import { SdkSigner } from '@unique-nft/sdk/extrinsics';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SdkSigner;
}
