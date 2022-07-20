import { KeypairType } from '@polkadot/util-crypto/types';
import { KeyringPair } from '@polkadot/keyring/types';

export interface KeyringLocalOptions {
  SS58Prefix?: number;
  genesisHash?: string;
  type?: KeypairType;

  passwordCallback: PasswordCallback;
}

export type PasswordCallback = (keyring: KeyringPair) => Promise<string>;
