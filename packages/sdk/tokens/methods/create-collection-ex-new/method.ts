import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import {
  Balance,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { SchemaTools } from '@unique-nft/api';
import { sumBalance } from '@unique-nft/sdk/utils';

import { CollectionIdArguments } from '../../types/shared';
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

    if (!schema) {
      return {
        address,
        section: 'unique',
        method: 'createCollectionEx',
        args: [encodedBase],
      };
    }

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

  override async getFee(
    args: UnsignedTxPayload | SubmitTxArguments | CreateCollectionNewArguments,
  ): Promise<Balance> {
    const txFee = await super.getFee(args);
    const additionalFee = this.sdk.api.consts.common.collectionCreationPrice;

    return sumBalance(txFee, additionalFee);
  }
}
