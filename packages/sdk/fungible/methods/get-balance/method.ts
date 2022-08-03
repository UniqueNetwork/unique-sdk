import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { Balance } from '@unique-nft/sdk/types';
import {
  addressToCrossAccountId,
  bytesToString,
  formatBalance,
} from '@unique-nft/sdk/utils';
import { SdkError } from '@unique-nft/sdk/errors';
import { GetFungibleBalanceArgs } from './types';

async function getFungibleBalanceFn(
  this: Sdk,
  args: GetFungibleBalanceArgs,
): Promise<Balance> {
  const { collectionId, address } = args;

  const collectionOption = await this.api.rpc.unique.collectionById(
    collectionId,
  );

  const collection = collectionOption.unwrapOr(null);

  if (!collection) throw new SdkError(`No collection with id ${collectionId}`);

  if (!collection.mode.isFungible) {
    throw new SdkError(
      `Collection ${
        args.collectionId
      } is ${collection.mode.toString()}, not Fungible`,
    );
  }

  const decimals = collection.mode.asFungible.toNumber() || 0;
  const unit = collection.tokenPrefix
    ? bytesToString(collection.tokenPrefix)
    : 'UNIT';

  const rawBalance = await this.api.rpc.unique.balance(
    collectionId,
    addressToCrossAccountId(address),
    0,
  );

  return formatBalance({ decimals, unit }, rawBalance);
}

export const getFungibleBalance: QueryMethod<GetFungibleBalanceArgs, Balance> =
  getFungibleBalanceFn;
