import { KeyringPair } from '@polkadot/keyring/types';
import { KeyringOptions } from '@polkadot/ui-keyring/types';

export interface KeyringLocalOptions extends KeyringOptions {
  passwordCallback?: PasswordCallback;
}

export type PasswordCallback = (keyring: KeyringPair) => Promise<string>;
