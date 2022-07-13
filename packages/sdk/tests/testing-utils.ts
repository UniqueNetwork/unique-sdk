/* eslint-disable @typescript-eslint/dot-notation */
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { HexString } from '@polkadot/util/types';
import { SdkOptions } from '@unique-nft/sdk/types';
import { Sdk } from '@unique-nft/sdk';
import { createSigner, SdkSigner } from '@unique-nft/accounts/sign';
import * as process from 'process';

const TEST_RICH_ACCOUNT = process.env['TEST_RICH_ACCOUNT'] || '//Bob';
const TEST_POOR_ACCOUNT = process.env['TEST_POOR_ACCOUNT'] || '//Alice';
const TEST_ANOTHER_ACCOUNT = process.env['TEST_ANOTHER_ACCOUNT'] || '//Eve';
const TEST_CHAIN_WS_URL =
  process.env['TEST_CHAIN_WS_URL'] || 'wss://ws-rc.unique.network';

export async function createSdk(withSign: boolean): Promise<Sdk> {
  const signer: SdkSigner | undefined = withSign
    ? await createSigner({
        seed: TEST_RICH_ACCOUNT,
      })
    : undefined;

  const options: SdkOptions = {
    chainWsUrl: TEST_CHAIN_WS_URL,
    signer,
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
export const createRichAccount = () => createAccount(TEST_RICH_ACCOUNT);
export const createPoorAccount = () => createAccount(TEST_POOR_ACCOUNT);
export const createAnotherAccount = () => createAccount(TEST_ANOTHER_ACCOUNT);

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
