import { CreateCollectionArguments } from '@unique-nft/sdk/tokens';

export interface CreateFungibleCollectionArguments
  extends Omit<
    CreateCollectionArguments,
    'properties' | 'tokenPropertyPermissions'
  > {
  decimals: number;
}
