import { ApiPromise } from '@polkadot/api';
import { SdkCollections } from './sdk-collections';
import { SdkTokens } from './sdk-tokens';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly api: ApiPromise;
    readonly collections: SdkCollections;
    readonly tokens: SdkTokens;
  }
}
