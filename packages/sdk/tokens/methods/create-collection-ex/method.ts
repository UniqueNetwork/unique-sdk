import {
  CollectionInfo,
  CreateCollectionArguments,
  TxBuildArguments,
} from '@unique-nft/sdk/types';
import { encodeCollection } from '@unique-nft/sdk/tokens';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32, u8 } from '@polkadot/types-codec';
import { AccountId32 } from '@polkadot/types/interfaces/runtime';
import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';

export class CreateCollectionExMutation extends MutationMethodBase<
  CreateCollectionArguments,
  CollectionInfo
> {
  async transformArgs(
    args: CreateCollectionArguments,
  ): Promise<TxBuildArguments> {
    const { address, ...rest } = args;

    const encodedCollection = encodeCollection(
      this.sdk.api.registry,
      rest,
    ).toHex();

    return {
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<CollectionInfo | undefined> {
    const createCollectionEvent = result.findRecord(
      'common',
      'CollectionCreated',
    );

    if (!createCollectionEvent) return undefined;

    const [id] = createCollectionEvent.event.data as unknown as [
      u32,
      u8,
      AccountId32,
    ];

    const collectionInfo = await this.sdk.collections.get({
      collectionId: id.toNumber(),
    });

    return collectionInfo ?? undefined;
  }
}
