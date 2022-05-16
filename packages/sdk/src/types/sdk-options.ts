import { HexString } from '@polkadot/util/types';

export interface SdkOptions {
  chainWsUrl: string;
  ipfsGatewayUrl: string;
  signer?: SdkSigner;
}

export interface SdkSigner {
  sign(payload: string): HexString;
}
