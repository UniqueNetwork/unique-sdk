import { evmToAddress } from '@polkadot/util-crypto';

export async function ethereumAddressToSubstrate(
  ethAddress: string,
  ss58prefix: number,
): Promise<string> {
  return evmToAddress(ethAddress, ss58prefix);
}

export async function wrapAddress(
  address: string,
  ss58prefix: number,
): Promise<string> {
  return address.indexOf('0x') === 0
    ? ethereumAddressToSubstrate(address, ss58prefix)
    : address;
}
