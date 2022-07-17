import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import {
  CollectionIdArguments,
  decodeCollectionBase,
} from '@unique-nft/sdk/tokens';
import { FungibleCollection } from './types';
import { SdkError } from '../../../errors';

async function collectionByIdFn(
  this: Sdk,
  args: CollectionIdArguments,
): Promise<FungibleCollection | null> {
  const collectionOption = await this.api.rpc.unique.collectionById(
    args.collectionId,
  );

  const collection = collectionOption.unwrapOr(null);
  if (!collection) return null;

  if (!collection.mode.isFungible) {
    throw new SdkError(
      `Collection ${
        args.collectionId
      } is ${collection.mode.toString()}, not Fungible`,
    );
  }

  const decimals = collection.mode.asFungible.toNumber();

  const decoded = decodeCollectionBase(collection);

  return {
    ...decoded,
    decimals,
    id: args.collectionId,
    owner: collection.owner.toString(),
  };
}

export const collectionById: QueryMethod<
  CollectionIdArguments,
  FungibleCollection
> = collectionByIdFn;
