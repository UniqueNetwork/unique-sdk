import type { Option, bool } from '@polkadot/types-codec';
import type { INumber } from '@polkadot/types-codec/types';
import { UpDataStructsSponsoringRateLimit } from '@unique-nft/types/unique/types';

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
