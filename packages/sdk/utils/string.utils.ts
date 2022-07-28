import type { Bytes } from '@polkadot/types-codec';
import { hexToString } from '@polkadot/util';
import {
  cryptoWaitReady,
  decodeAddress,
  encodeAddress,
} from '@polkadot/util-crypto';
import { Address, CrossAccountId } from '@unique-nft/sdk/types';

export const ETHEREUM_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

export const utf16ToString = (input: Array<{ toNumber(): number }>): string =>
  String.fromCharCode(
    ...input.map((char) => char.toNumber()).filter((num) => num),
  );

export function stringToUTF16(input: string): number[] {
  return Array.from(input).map((x) => x.charCodeAt(0));
}

export function bytesToString(input: Bytes): string {
  return hexToString(input.toHex());
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function bytesToJson(input: Bytes): any | undefined {
  try {
    return JSON.parse(bytesToString(input));
  } catch (e) {
    return undefined;
  }
}

export function normalizeAddress(address: Address, ss58Format?: number) {
  return encodeAddress(decodeAddress(address), ss58Format);
}

export async function normalizeAddressAsync(
  address: Address,
  ss58Format?: number,
): Promise<string> {
  await cryptoWaitReady();

  return normalizeAddress(address, ss58Format);
}

export function isEthereumAddress(address: Address) {
  return ETHEREUM_ADDRESS_REGEX.test(address);
}

export function addressToCrossAccountId(address: Address): CrossAccountId {
  if (isEthereumAddress(address)) return { Ethereum: address };

  return { Substrate: address };
}

export const toJsonObject = (data: object) =>
  JSON.parse(
    JSON.stringify(data, (key, value) =>
      // todo use toHuman() in Codec interface
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
