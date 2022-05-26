import { SdkExtrinsics } from './sdk-extrinsics';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly extrinsics: SdkExtrinsics;
  }
}
