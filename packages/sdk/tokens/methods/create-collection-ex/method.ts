import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import {
  Balance,
  SubmitTxArguments,
  TxBuildArguments,
  UnsignedTxPayload,
} from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { sumBalance } from '@unique-nft/sdk/utils';
import { encodeCollection } from '../../utils';
import { CreateCollectionArguments } from './types';
import { CollectionIdArguments } from '../../types/shared';

/* eslint-disable class-methods-use-this */

export class CreateCollectionExMutation extends MutationMethodBase<
  CreateCollectionArguments,
  CollectionIdArguments
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
    args: UnsignedTxPayload | SubmitTxArguments | CreateCollectionArguments,
  ): Promise<Balance> {
    const txFee = await super.getFee(args);
    const additionalFee = this.sdk.api.consts.common.collectionCreationPrice;

    return sumBalance(txFee, additionalFee);
  }
}
