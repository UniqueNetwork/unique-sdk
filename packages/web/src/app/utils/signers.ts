import { InvalidSignerError } from '@unique-nft/sdk/errors';
import {
  createSignerSync,
  SeedSignerOptions,
  UriSignerOptions,
} from '@unique-nft/sdk/sign';

const authorizationReg = /^(Seed\s+(?<seed>.+))|(Uri\s+(?<uri>\/\/\w+))$/;
export function createSignerByAuthHead(authHead: string) {
  const exec = authorizationReg.exec(authHead);
  if (!exec || !exec.groups) {
    throw new InvalidSignerError('Invalid authorization header');
  }

  const { seed, uri } = exec.groups;
  let signerOptions;
  if (seed) {
    signerOptions = new SeedSignerOptions(seed);
  } else if (uri) {
    signerOptions = new UriSignerOptions(uri);
  } else {
    throw new InvalidSignerError('Invalid authorization header');
  }

  return createSignerSync(signerOptions);
}
