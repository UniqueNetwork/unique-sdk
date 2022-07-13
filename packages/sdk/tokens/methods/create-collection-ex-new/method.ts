import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { SchemaTools } from '@unique-nft/api';

import { CollectionIdArguments } from '../collection-by-id/types';
import { CreateCollectionNewArguments } from './types';
import { encodeCollectionBase } from '../../utils/encode-collection';
import { AttributesTransformer } from './utils';

/* eslint-disable class-methods-use-this */

export class CreateCollectionExNewMutation extends MutationMethodBase<
  CreateCollectionNewArguments,
  CollectionIdArguments
> {
  async transformArgs(
    args: CreateCollectionNewArguments,
  ): Promise<TxBuildArguments> {
    const { address, schema, ...rest } = args;

    const encodedBase = encodeCollectionBase(this.sdk.api.registry, rest);

    const properties = SchemaTools.encodeUnique.collectionSchema(
      AttributesTransformer.toOriginal(schema),
    );

    const tokenPropertyPermissions =
      SchemaTools.encodeUnique.collectionTokenPropertyPermissions(
        AttributesTransformer.toOriginal(schema),
      );

    const encodedCollection = {
      ...encodedBase,
      properties,
      tokenPropertyPermissions,
    };

    return {
      address,
      section: 'unique',
      method: 'createCollectionEx',
      args: [encodedCollection],
    };
  }

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
