import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  mnemonicValidate,
  naclBoxPairFromSecret,
} from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { ValidationError } from '@unique-nft/sdk/errors';

import { Account, GenerateAccountArgs, GetAccountArgs } from './types';

export async function getAccountFromMnemonic(
  args: GetAccountArgs,
): Promise<Account> {
  const { mnemonic, password, pairType, meta } = args;
  if (!mnemonicValidate(mnemonic)) {
    throw new ValidationError({ mnemonic }, 'Invalid mnemonic phrase');
  }
  const seed = mnemonicToMiniSecret(mnemonic, password);
  const { publicKey } = naclBoxPairFromSecret(seed);
  const account = new Keyring({ type: pairType }).addFromSeed(
    seed,
    { ...meta },
    pairType,
  );
  const keyfile: KeyringPair$Json = account.toJson(password);
  return {
    mnemonic,
    seed: u8aToHex(seed),
    publicKey: u8aToHex(publicKey),
    keyfile,
  };
}

export async function generateAccount(
  args: GenerateAccountArgs,
): Promise<Account> {
  const mnemonic = mnemonicGenerate();
  return getAccountFromMnemonic({
    ...args,
    mnemonic,
  });
}
