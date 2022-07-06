import { UpDataStructsCollectionLimits } from '@unique-nft/unique-mainnet-types/default/index';
import { bool, Option } from '@polkadot/types-codec';
import { UpDataStructsSponsoringRateLimit } from '@unique-nft/unique-mainnet-types/default/types';
import { INumber } from '@polkadot/types-codec/types';
import { Registry } from '@polkadot/types/types';
import { CollectionLimits } from './types';

export function toNumber(input: Option<INumber>): number | null {
  let result = input.unwrapOr(undefined)?.toNumber();
  if (result !== undefined) {
    return result;
  }
  result = input?.toHuman() as number;
  if (result !== undefined) {
    return result;
  }
  return null;
}

export function toBoolean(input: Option<bool>): boolean | null {
  let result = input.unwrapOr(undefined)?.toHuman();
  if (result !== undefined) {
    return result;
  }
  result = input?.toHuman() as boolean;
  if (result !== undefined) {
    return result;
  }
  return null;
}

export function sponsoredDataRateLimitToNumber(
  input: Option<UpDataStructsSponsoringRateLimit>,
): number {
  let sponsoringRateLimit = input.unwrapOr(undefined);
  if (sponsoringRateLimit === undefined) {
    sponsoringRateLimit = input.toHuman() as unknown as UpDataStructsSponsoringRateLimit;
  }

  return sponsoringRateLimit && sponsoringRateLimit.isBlocks
    ? sponsoringRateLimit.asBlocks.toNumber()
    : 0; // todo точно?
}

export const decodeCollectionLimits = (
  limits: UpDataStructsCollectionLimits,
): CollectionLimits => ({
  accountTokenOwnershipLimit: toNumber(limits.accountTokenOwnershipLimit),
  sponsoredDataSize: toNumber(limits.sponsoredDataSize),
  sponsoredDataRateLimit: sponsoredDataRateLimitToNumber(
    limits.sponsoredDataRateLimit,
  ),
  tokenLimit: toNumber(limits.tokenLimit),
  sponsorTransferTimeout: toNumber(limits.sponsorTransferTimeout),
  sponsorApproveTimeout: toNumber(limits.sponsorApproveTimeout),
  ownerCanTransfer: toBoolean(limits.ownerCanTransfer),
  ownerCanDestroy: toBoolean(limits.ownerCanDestroy),
  transfersEnabled: toBoolean(limits.transfersEnabled),
});
