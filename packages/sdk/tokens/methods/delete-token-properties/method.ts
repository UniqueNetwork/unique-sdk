import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import {
  DeleteTokenPropertiesArguments,
  DeleteTokenPropertiesResult,
} from './types';

/* eslint-disable class-methods-use-this */

export class DeleteTokenPropertiesMutation extends MutationMethodBase<
  DeleteTokenPropertiesArguments,
  DeleteTokenPropertiesResult
> {
  async transformArgs(
    args: DeleteTokenPropertiesArguments,
  ): Promise<TxBuildArguments> {
    const { address, collectionId, tokenId, propertyKeys } = args;

    return {
      address,
      section: 'unique',
      method: 'deleteTokenProperties',
      args: [collectionId, tokenId, propertyKeys],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<DeleteTokenPropertiesResult> {
    return result.events
      .filter(
        ({ event }) =>
          event.section === 'common' && event.method === 'TokenPropertyDeleted',
      )
      .map(({ event }) => {
        const [collectionId, tokenId, propertyKey] = event.data as unknown as [
          u32,
          u32,
          Bytes,
        ];

        return {
          collectionId: collectionId.toNumber(),
          tokenId: tokenId.toNumber(),
          property: bytesToString(propertyKey),
        };
      });
  }
}
