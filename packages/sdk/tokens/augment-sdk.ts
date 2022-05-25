import { SdkCollection } from './sdk-collection';
import { SdkToken } from './sdk-token';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly collection: SdkCollection;
    readonly token: SdkToken;
  }
}
