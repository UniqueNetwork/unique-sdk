import { KeyringPair } from '@polkadot/keyring/types';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import { TxBuildArguments, Balance } from '@unique-nft/sdk/types';

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

    const buildArgs: TxBuildArguments = {
      address: bob.address,
      section: 'balances',
      method: 'transfer',
      args: [alice.address, 1000_000],
    };

    const txPayload = await sdk.extrinsics.build(buildArgs);

    expect(txPayload).toMatchObject({
      signerPayloadHex: expect.any(String),
      signerPayloadJSON: expect.any(Object),
      signerPayloadRaw: expect.any(Object),
    });

    const { signerPayloadJSON, signerPayloadHex } = txPayload;

    const signature = signWithAccount(sdk, bob, signerPayloadHex);

    const signed = {
      signature,
      signerPayloadJSON,
    };

    const feeFromArgs = await sdk.extrinsics.getFee(buildArgs);
    const feeFromUnsigned = await sdk.extrinsics.getFee(txPayload);
    const feeFromSigned = await sdk.extrinsics.getFee(signed);

    expect(feeFromArgs).toMatchObject<Balance>({
      amount: expect.any(String),
      formatted: expect.any(String),
      decimals: expect.any(Number),
      raw: expect.any(String),
      unit: expect.any(String),
    });

    expect(feeFromArgs).toEqual(feeFromUnsigned);
    expect(feeFromUnsigned).toEqual(feeFromSigned);

    const submitPromise = sdk.extrinsics.submit(signed);

    await expect(submitPromise).resolves.toMatchObject({
      hash: expect.any(String),
    });
  });

  afterAll(async () => {
    await sdk.api.disconnect();
  });
});
