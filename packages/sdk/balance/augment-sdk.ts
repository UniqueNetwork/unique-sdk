import { ApiPromise } from '@polkadot/api';
import { SdkBalance } from './sdk-balance';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    api: ApiPromise;
    readonly balance: SdkBalance;
  }
}
