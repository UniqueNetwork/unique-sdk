import { ApiPromise } from '@polkadot/api';
import { SdkFungible } from './sdk-fungible';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    api: ApiPromise;
    readonly fungible: SdkFungible;
  }
}
