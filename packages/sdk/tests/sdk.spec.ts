import { KeyringPair } from '@polkadot/keyring/types';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { Sdk } from '../src/lib/sdk';
import {
  getDefaultSdkOptions,
  signWithAccount,
  getKeyringPairs,
} from './testing-utils';

describe(Sdk.name, () => {
  let sdk: Sdk;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    sdk = await Sdk.create(getDefaultSdkOptions());

    const testAccounts = await getKeyringPairs();
    alice = testAccounts.alice;
    bob = testAccounts.bob;
  });

  it('balances transfer build & submit test', async () => {
    expect(Sdk).toBeDefined();

    const txPayload = await sdk.extrinsics.build({
      address: bob.address,
      section: 'balances',
      method: 'transfer',
      args: [alice.address, 1000_000],
    });

    expect(txPayload).toMatchObject({
      signerPayloadHex: expect.any(String),
      signerPayloadJSON: expect.any(Object),
      signerPayloadRaw: expect.any(Object),
    });

    const { signerPayloadJSON, signerPayloadHex } = txPayload;

    const signature = signWithAccount(sdk, bob, signerPayloadHex);

    const submitPromise = sdk.extrinsics.submit({
      signature,
      signerPayloadJSON,
    });

    await expect(submitPromise).resolves.toMatchObject({
      hash: expect.any(String),
    });
  });

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
