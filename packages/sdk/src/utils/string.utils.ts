import type { Bytes } from '@polkadot/types-codec';
import { hexToString } from '@polkadot/util';
import {
  cryptoWaitReady,
  decodeAddress,
  encodeAddress,
} from '@polkadot/util-crypto';

export const utf16ToString = (input: Array<{ toNumber(): number }>): string =>
  String.fromCharCode(...input.map((char) => char.toNumber()));

export function stringToUTF16(input: string): number[] {
  return Array.from(input).map((x) => x.charCodeAt(0));
}

export function bytesToString(input: Bytes): string {
  return hexToString(input.toHex());
}

export function bytesToJson(input: Bytes): any | undefined {
  try {
    return JSON.parse(bytesToString(input));
  } catch (e) {
    return undefined;
  }
}

export function normalizeAddress(address: string, ss58Format?: number) {
  return encodeAddress(decodeAddress(address), ss58Format);
}

export async function normalizeAddressAsync(
  address: string,
  ss58Format?: number,
): Promise<string> {
  await cryptoWaitReady();

  return normalizeAddress(address, ss58Format);
}
