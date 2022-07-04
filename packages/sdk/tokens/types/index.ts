import { CollectionIdArguments } from '../methods/collection-by-id/types';

export * from '../methods/create-collection-ex/types';
export * from '../methods/collection-by-id/types';
export * from '../methods/set-collection-limits/types';

export interface TokenIdArguments extends CollectionIdArguments {
  tokenId: number;
}

export interface BurnTokenArguments extends TokenIdArguments {
  address: string;
}
export interface TransferTokenArguments extends TokenIdArguments {
  from: string;
  to: string;
}
