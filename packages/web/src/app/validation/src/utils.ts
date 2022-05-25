import { mnemonicValidate } from '@polkadot/util-crypto';

const uriRegEx = /^(\/\/[^/]+){1,2}(\/\/\/[^/]+)?$/;
export function validateSeed(value: string): boolean {
  return uriRegEx.test(value) || mnemonicValidate(value);
}
