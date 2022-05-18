import { cryptoWaitReady } from '@polkadot/util-crypto';
import { validateSync } from '@unique-nft/sdk/validation';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/extrinsics';
import {
  KeyfileSignerOptions,
  SeedSignerOptions,
  SignerOptions,
  UriSignerOptions,
} from './types';
import { SeedSigner } from './seed-signer';
import { KeyfileSigner } from './keyfile-signer';

export async function createSigner(
  signerOptions: SignerOptions,
): Promise<SdkSigner> {
  await cryptoWaitReady();

  if ('seed' in signerOptions) {
    validateSync(signerOptions, SeedSignerOptions);
    try {
      return new SeedSigner(signerOptions.seed, signerOptions.type);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }
  if ('uri' in signerOptions) {
    validateSync(signerOptions, UriSignerOptions);
    try {
      return new SeedSigner(signerOptions.uri, signerOptions.type);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }
  if ('keyfile' in signerOptions) {
    validateSync(signerOptions, KeyfileSignerOptions);
    try {
      return new KeyfileSigner(signerOptions);
    } catch (err: any) {
      throw new InvalidSignerError(err.message);
    }
  }

  throw new InvalidSignerError('Not known options');
}

const authorizationReg = /^(Seed\s+(?<seed>.+))|(Uri\s+(?<uri>\/\/\w+))$/;
export function createSignerByAuthorizationHead(
  authorization: string,
): Promise<SdkSigner | null> {
  const exec = authorizationReg.exec(authorization);
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

  return createSigner(signerOptions);
}
