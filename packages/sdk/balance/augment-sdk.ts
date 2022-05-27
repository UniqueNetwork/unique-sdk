import { SdkBalance } from './sdk-balance';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly balance: SdkBalance;
  }
}
