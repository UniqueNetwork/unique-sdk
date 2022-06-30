import { CollectionIdArguments } from '../methods/collection-by-id/types';

export * from '../methods/create-collection-ex/types';
export * from '../methods/collection-by-id/types';
export * from '../methods/nest-token/types';
export * from '../methods/unnest-token/types';
export * from '../methods/token-children/types';

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
