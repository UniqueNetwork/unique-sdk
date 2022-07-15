import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import {
  CollectionIdArguments,
  CollectionInfoBase,
  CollectionMode,
  encodeCollectionBase,
} from '@unique-nft/sdk/tokens';
import { u32 } from '@polkadot/types-codec';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { CreateFungibleCollectionArguments } from './types';

export class CreateCollectionMutation extends MutationMethodBase<
  CreateFungibleCollectionArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: CreateFungibleCollectionArguments,
  ): Promise<TxBuildArguments> {
    const { address, ...rest } = args;

    const collection: Partial<CollectionInfoBase> = {
      ...rest,
      mode: CollectionMode.Fungible,
    };

    const encodedCollection = encodeCollectionBase(
      this.sdk.api.registry,
      collection,
      { mode: { [CollectionMode.Fungible]: rest.decimals } },
    );

    return {
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async transformResult(
    result: ISubmittableResult,
  ): Promise<CollectionIdArguments | undefined> {
    const createCollectionEvent = result.findRecord(
      'common',
      'CollectionCreated',
    );

    if (!createCollectionEvent) return undefined;

    const [id] = createCollectionEvent.event.data as unknown as [u32];

    return {
      collectionId: id.toNumber(),
    };
  }
}
