import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  naclBoxPairFromSecret,
} from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import { validate } from '@unique-nft/sdk/validation';

import { Account, GenerateAccountArgs, GetAccountArgs } from './types';

export async function getAccountFromMnemonic(
  args: GetAccountArgs,
): Promise<Account> {
  await validate(args, GetAccountArgs);
  const { mnemonic, password, pairType, meta } = args;
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
