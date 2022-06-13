import { SdkCollections } from './sdk-collections';
import { SdkTokens } from './sdk-tokens';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly collections: SdkCollections;
    readonly tokens: SdkTokens;
  }
}
