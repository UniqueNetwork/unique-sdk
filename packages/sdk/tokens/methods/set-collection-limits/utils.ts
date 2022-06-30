import { UpDataStructsCollectionLimits } from '@unique-nft/unique-mainnet-types/default/index';
import { bool, Option } from '@polkadot/types-codec';
import { UpDataStructsSponsoringRateLimit } from '@unique-nft/unique-mainnet-types/default/types';
import { INumber } from '@polkadot/types-codec/types';
import { Registry } from '@polkadot/types/types';
import { CollectionLimits } from './types';

export function toNumber(input: Option<INumber>): number | null {
  return input.unwrapOr(undefined)?.toNumber() || null;
}

export function toBoolean(input: Option<bool>): boolean | null {
  return input.unwrapOr(undefined)?.toHuman() || null;
}

export function sponsoredDataRateLimitToNumber(
  input: Option<UpDataStructsSponsoringRateLimit>,
): number | null {
  const sponsoringRateLimit = input.unwrapOr(undefined);

  return sponsoringRateLimit && sponsoringRateLimit.isBlocks
    ? sponsoringRateLimit.asBlocks.toNumber()
    : null;
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

export const encodeSponsoredDataRateLimit = (
  registry: Registry,
  input: number | null,
): UpDataStructsSponsoringRateLimit => {
  const asObject =
    input && input > 0
      ? { Blocks: input, isSponsoringDisabled: false }
      : { isSponsoringDisabled: true };

  const encoded = registry.createType<UpDataStructsSponsoringRateLimit>(
    'UpDataStructsSponsoringRateLimit',
    asObject,
  );

  return encoded;
};