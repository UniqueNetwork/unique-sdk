import { Sdk } from '@unique-nft/sdk';
import { QueryMethod } from '@unique-nft/sdk/extrinsics';
import { PalletEvmAccountBasicCrossAccountIdRepr } from '@unique-nft/unique-mainnet-types';
import { Option } from '@polkadot/types-codec';
import { TokenParentArguments, TokenParentResult } from './types';
import {
  getTokenIdFromNestingAddress,
  getCollectionIdFromNestingAddress,
  isNestingAddress,
} from '../../utils';

export function tryParseParent(
  owner: Option<PalletEvmAccountBasicCrossAccountIdRepr>,
): TokenParentResult | null {
  const unwrapped = owner?.unwrapOr(null);

  if (unwrapped === null) return null;

  if (!unwrapped.isEthereum) return null;

  const address = unwrapped.asEthereum.toString();

  if (!isNestingAddress(address)) return null;

  const collectionId = getCollectionIdFromNestingAddress(address);
  const tokenId = getTokenIdFromNestingAddress(address);

  return {
    address,
    collectionId,
    tokenId,
  };
}

async function tokenParent(
  this: Sdk,
  args: TokenParentArguments,
): Promise<TokenParentResult | null> {
  const tokenOwnerOption = await this.api.rpc.unique.tokenOwner(
    args.collectionId,
    args.tokenId,
  );

  return tryParseParent(tokenOwnerOption);
}

export const tokenParentQuery: QueryMethod<
  TokenParentArguments,
  TokenParentResult
> = tokenParent;
