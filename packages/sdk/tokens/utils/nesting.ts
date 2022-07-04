import { keccakAsHex } from '@polkadot/util-crypto';
import { Address } from '@unique-nft/sdk/types';

const NESTING_ADDRESS_PREFIX = '0xf8238ccfff8ed887463fd5e0';

export function getNestingTokenAddress(collectionId: number, tokenId: number) {
  let address = `${NESTING_ADDRESS_PREFIX}${collectionId
    .toString(16)
    .padStart(8, '0')}${tokenId.toString(16).padStart(8, '0')}`;

  if (typeof address === 'undefined') return '';

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
    throw new Error(
      `Given address "${address}" is not a valid Ethereum address.`,
    );

  address = address.toLowerCase().replace(/^0x/i, '');
  const addressHash = keccakAsHex(address).replace(/^0x/i, ''); // only here changed
  const checksumAddress = ['0x'];

  for (let i = 0; i < address.length; i += 1) {
    // If ith character is 8 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress.push(address[i].toUpperCase());
    } else {
      checksumAddress.push(address[i]);
    }
  }
  return checksumAddress.join('');
}

export function isNestingAddress(address: Address): boolean {
  return address.indexOf(NESTING_ADDRESS_PREFIX) === 0 && address.length === 42;
}

export function getCollectionIdFromNestingAddress(address: Address): number {
  if (!isNestingAddress(address)) return 0;

  const collectionString = address.slice(
    NESTING_ADDRESS_PREFIX.length,
    NESTING_ADDRESS_PREFIX.length + 8,
  );

  return parseInt(collectionString, 16);
}

export function getTokenIdFromNestingAddress(address: Address): number {
  if (!isNestingAddress(address)) return 0;

  const tokenString = address.slice(
    NESTING_ADDRESS_PREFIX.length + 8,
    NESTING_ADDRESS_PREFIX.length + 25,
  );

  return parseInt(tokenString, 16);
}
