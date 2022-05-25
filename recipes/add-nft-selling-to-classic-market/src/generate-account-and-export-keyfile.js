import { Keyring } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  cryptoWaitReady,
} from '@polkadot/util-crypto';

const mnemonic = mnemonicGenerate();
console.log(`mnemonic: ${mnemonic}`);

const seedBytes = mnemonicToMiniSecret(mnemonic);
const seedString = u8aToHex(seedBytes);
console.log(`seed: ${seedString}`);

async function exportKeyfile() {
  await cryptoWaitReady();

  const account = new Keyring({ type: 'sr25519' }).addFromSeed(seedBytes);
  const keyfile = account.toJson();
  console.log(`keyfile:`, keyfile);
}

exportKeyfile();
