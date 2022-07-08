import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { TxBuildArguments } from '@unique-nft/sdk/types';
import { ISubmittableResult } from '@polkadot/types/types/extrinsic';
import { u32 } from '@polkadot/types-codec';
import { SdkError } from '@unique-nft/sdk/errors';
import { SchemaTools } from '@unique-nft/api';
import { CreateTokenNewArguments } from './types';
import { TokenIdArguments } from '../../types';

/* eslint-disable class-methods-use-this */

export class CreateTokenNewMutation extends MutationMethodBase<
  CreateTokenNewArguments,
  TokenIdArguments
> {
  async transformArgs(
    args: CreateTokenNewArguments,
  ): Promise<TxBuildArguments> {
    const { collectionId, address, owner, data } = args;

    const collection = await this.sdk.collections.get_new({ collectionId });
    if (!collection) throw new SdkError(`no collection ${collectionId}`);

    const encodedToken = SchemaTools.encodeUnique.token(
      data,
      collection.schema,
    );

    return {
      address,
      section: 'unique',
      method: 'createItem',
      args: [collectionId, { substrate: owner || address }, encodedToken],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<TokenIdArguments | undefined> {
    const createCollectionEvent = result.findRecord('common', 'ItemCreated');

    if (!createCollectionEvent) return undefined;

    const [collectionId, tokenId] = createCollectionEvent.event
      .data as unknown as [u32, u32];

    return {
      collectionId: collectionId.toNumber(),
      tokenId: tokenId.toNumber(),
    };
  }
}
