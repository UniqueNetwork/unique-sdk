import { MutationMethodBase } from '@unique-nft/sdk/extrinsics';
import { ISubmittableResult, TxBuildArguments } from '@unique-nft/sdk/types';
import { u32, Bytes } from '@polkadot/types-codec';
import { bytesToString } from '@unique-nft/sdk/utils';
import { SetTokenPropertiesArguments, SetTokenPropertiesResult } from './types';

/* eslint-disable class-methods-use-this */

export class SetTokenPropertiesMutation extends MutationMethodBase<
  SetTokenPropertiesArguments,
  SetTokenPropertiesResult
> {
  async transformArgs(
    args: SetTokenPropertiesArguments,
  ): Promise<TxBuildArguments> {
    const { address, collectionId, tokenId, properties } = args;

    return {
      address,
      section: 'unique',
      method: 'setTokenProperties',
      args: [collectionId, tokenId, properties],
    };
  }

  async transformResult(
    result: ISubmittableResult,
  ): Promise<SetTokenPropertiesResult> {
    return result.events
      .filter(
        ({ event }) =>
          event.section === 'common' && event.method === 'TokenPropertySet',
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
