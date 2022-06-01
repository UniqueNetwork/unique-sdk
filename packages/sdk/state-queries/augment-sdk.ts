import { SdkStateQueries } from './sdk-state-queries';

declare module '@unique-nft/sdk' {
  export interface Sdk {
    readonly stateQueries: SdkStateQueries;
  }
}
