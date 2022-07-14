import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  naclBoxPairFromSecret,
} from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

import {
  Account,
  GenerateAccountArguments,
  GetAccountArguments,
} from './types';

export async function getAccountFromMnemonic(
  args: GetAccountArguments,
): Promise<Account> {
  const { mnemonic, pairType, meta } = args;
  const seed = mnemonicToMiniSecret(mnemonic);
  const { publicKey } = naclBoxPairFromSecret(seed);
  const account = new Keyring({ type: pairType }).addFromSeed(
    seed,
    { ...meta },
    pairType,
  );
  const keyfile: KeyringPair$Json = account.toJson();
  return {
    mnemonic,
    seed: u8aToHex(seed),
    publicKey: u8aToHex(publicKey),
    keyfile,
  };
}

export async function generateAccount(
  args: GenerateAccountArguments,
): Promise<Account> {
  const mnemonic = mnemonicGenerate();
  return getAccountFromMnemonic({
    ...args,
    mnemonic,
  });
}
