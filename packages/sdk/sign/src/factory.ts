import { cryptoWaitReady } from '@polkadot/util-crypto';
import { InvalidSignerError } from '@unique-nft/sdk/errors';
import { SdkSigner } from '@unique-nft/sdk/types';
import {
  KeyfileSignerOptions,
  PolkadotSignerOptions,
  SeedSignerOptions,
  SignerOptions,
} from './types';
import { SeedSigner } from './seed-signer';
import { KeyfileSigner } from './keyfile-signer';
import { PolkadotSigner } from './polkadot-signer';

type OptionsType<T> = {
  new (...args: any[]): T;
};
type SignerType<T> = {
  new (options: T): any;
};
function validateAndCreate<T extends object>(
  options: T,
  OptionsClass: OptionsType<T>,
  SignerClass: SignerType<T>,
): SdkSigner {
  // todo @ApiProperty validateSync in sign factory
  //validateSync(options, OptionsClass);
  try {
    return new SignerClass(options);
  } catch (err: any) {
    throw new InvalidSignerError(err.message);
  }
}

export function createSignerSync(signerOptions: SignerOptions): SdkSigner {
  if ('seed' in signerOptions) {
    return validateAndCreate(signerOptions, SeedSignerOptions, SeedSigner);
  }
  if ('keyfile' in signerOptions) {
    return validateAndCreate(
      signerOptions,
      KeyfileSignerOptions,
      KeyfileSigner,
    );
  }
  if ('choosePolkadotAccount' in signerOptions) {
    return validateAndCreate(
      signerOptions,
      PolkadotSignerOptions,
      PolkadotSigner,
    );
  }
  throw new InvalidSignerError('Not known options');
}

export async function createSigner(
  signerOptions: SignerOptions,
): Promise<SdkSigner> {
  await cryptoWaitReady();
  return createSignerSync(signerOptions);
}
