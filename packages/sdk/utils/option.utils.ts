import type { Option, bool } from '@polkadot/types-codec';
import type { INumber } from '@polkadot/types-codec/types';

export function toNumber(input: Option<INumber>): number | null {
  return input.unwrapOr(undefined)?.toNumber() || null;
}

export function toBoolean(input: Option<bool>): boolean | null {
  return input.unwrapOr(undefined)?.toHuman() || null;
}
