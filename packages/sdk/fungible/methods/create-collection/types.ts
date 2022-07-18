import {
  CreateCollectionArguments,
  CreateCollectionNewArguments,
} from '@unique-nft/sdk/tokens';

export interface CreateFungibleCollectionArgumentsBak
  extends Omit<
    CreateCollectionArguments,
    'properties' | 'tokenPropertyPermissions'
  > {
  decimals: number;
}

export interface CreateFungibleCollectionArguments
  extends Omit<CreateCollectionNewArguments, 'mode'> {
  decimals: number;
}
