import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { TokenParentArguments, TokenParentResult } from './types';
import {
  getTokenIdFromNestingAddress,
  getCollectionIdFromNestingAddress,
  isNestingAddress,
} from '../../utils';

async function tokenParent(
  this: Sdk,
  args: TokenParentArguments,
): Promise<TokenParentResult | null> {
  const tokenOwnerOption = await this.api.rpc.unique.tokenOwner(
    args.collectionId,
    args.tokenId,
  );

  const unwrap = tokenOwnerOption.unwrapOr(null);

  if (unwrap === null) return null;

  if (!unwrap.isEthereum) return null;

  const address = unwrap.asEthereum.toString();

  if (!isNestingAddress(address)) return null;

  const collectionId = getCollectionIdFromNestingAddress(address);
  const tokenId = getTokenIdFromNestingAddress(address);

  return {
    address,
    collectionId,
    tokenId,
  };
}

export const tokenParentQuery: QueryMethod<
  TokenParentArguments,
  TokenParentResult
> = tokenParent;
