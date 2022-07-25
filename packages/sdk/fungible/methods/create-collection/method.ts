import { TxBuildArguments } from '@unique-nft/sdk/types';
import {
  CollectionIdArguments,
  CollectionMode,
  CreateCollectionExNewMutation,
} from '@unique-nft/sdk/tokens';
import { MutationMethodWrap } from '@unique-nft/sdk/extrinsics';

import { CreateFungibleCollectionArguments } from './types';

export class CreateCollectionMutation
  extends CreateCollectionExNewMutation
  implements
    MutationMethodWrap<
      CreateFungibleCollectionArguments,
      CollectionIdArguments
    >
{
  override async transformArgs(
    args: CreateFungibleCollectionArguments,
  ): Promise<TxBuildArguments> {
    return super.transformArgs({
      ...args,
      mode: CollectionMode.Fungible,
      decimals: args.decimals || 0,
    });
  }
}
