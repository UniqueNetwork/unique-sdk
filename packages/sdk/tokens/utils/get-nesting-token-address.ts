import { keccakAsHex } from '@polkadot/util-crypto';

export function getNestingTokenAddress(collectionId: number, tokenId: number) {
  let address = `0xf8238ccfff8ed887463fd5e0${collectionId
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
