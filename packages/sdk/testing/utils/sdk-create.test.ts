/* eslint-disable @typescript-eslint/dot-notation */
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { HexString } from '@polkadot/util/types';
import { SdkOptions } from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { SignatureType } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';
import * as process from 'process';

const TEST_RICH_ACCOUNTS =
  process.env['TEST_RICH_ACCOUNTS'] || '//Bob,//Charlie,//Eve,//Dave,//Ferdie';
const TEST_POOR_ACCOUNT = process.env['TEST_POOR_ACCOUNT'] || '//Alice';
const TEST_CHAIN_WS_URL =
  process.env['TEST_CHAIN_WS_URL'] || 'wss://ws-rc.unique.network';

const getRichSeed = (): string => {
  const richSeeds = TEST_RICH_ACCOUNTS.split(',');
  const jestWorkerId = Number(process.env['JEST_WORKER_ID'] || '1') - 1;

  return richSeeds[jestWorkerId];
};

async function createSigner() {
  const keyringProvider = new KeyringProvider({
    type: SignatureType.Sr25519,
  });

  await keyringProvider.init();

  return keyringProvider.addSeed(getRichSeed()).getSigner();
}

export async function createSdk(withSign: boolean): Promise<Sdk> {
  const options: SdkOptions = {
    chainWsUrl: TEST_CHAIN_WS_URL,
    signer: withSign ? await createSigner() : undefined,
  };

  return Sdk.create(options);
}

export type TestAccount = {
  keyringPair: KeyringPair;
  seed: string;
  address: string;
};

function createAccount(seed: string): TestAccount {
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.addFromMnemonic(seed);
  return {
    keyringPair,
    seed,
    address: keyringPair.address,
  };
}
export const createRichAccount = () => createAccount(getRichSeed());
export const createPoorAccount = () => createAccount(TEST_POOR_ACCOUNT);

export function signWithAccount(
  sdk: Sdk,
  account: TestAccount,
  signerPayloadHex: HexString,
): HexString {
  return sdk.extrinsics.packSignatureType(
    account.keyringPair.sign(signerPayloadHex),
    account.keyringPair.type,
  );
}
