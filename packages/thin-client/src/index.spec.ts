import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { createSigner, SdkSigner } from '@unique-nft/accounts/sign';

import { ThinClient } from './index';

const baseUrl = 'http://localhost:3000';

const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

describe('balance', () => {
  it('transfer', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.build({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);

  it('sign', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.sign({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);

  it('submitWaitResult', async () => {
    const client = new ThinClient({ url: baseUrl }, 1);
    const response: object = await client.balance.transfer.submitWaitResult({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);
});

it('check balance changes', async () => {
  const client = new ThinClient({ url: baseUrl }, 1);
  const initBalanceResponse = await client.balance.get({ address: bobAddress });
  const transferResponse = await client.balance.transfer.submitWaitResult({
    address: bobAddress,
    destination: aliceAddress,
    amount: 0.00001,
  });
  const currentBalanceResponse = await client.balance.get({
    address: bobAddress,
  });
  expect(initBalanceResponse.availableBalance.raw).not.toBe(
    currentBalanceResponse.availableBalance.raw,
  );
}, 60_000);

describe('sign', () => {
  it('success', async () => {
    const signer: SdkSigner = await createSigner({ seed: '//Bob' });
    const client = new ThinClient({ url: baseUrl }, signer);
    const response = await client.balance.transfer.sign({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toMatchObject({
      signerPayloadJSON: expect.any(Object),
      signature: expect.any(String),
    });
  }, 60_000);

  it('error', async () => {
    const client = new ThinClient({ url: baseUrl }, null);
    expect(
      client.balance.transfer.sign({
        address: bobAddress,
        destination: aliceAddress,
        amount: 0.00001,
      }),
    ).rejects.toThrowError();
  });
});

describe('submit', () => {
  let bob: KeyringPair;
  let alice: KeyringPair;

  beforeAll(async () => {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });

    bob = keyring.addFromUri('//Bob');
    alice = keyring.addFromUri('//Alice');
  });

  it('success', async () => {
    const signer: SdkSigner = await createSigner({ seed: '//Bob' });
    const client = new ThinClient({ url: baseUrl }, signer);
    const response = await client.balance.transfer.submit({
      address: bob.address,
      destination: alice.address,
      amount: 0.00001,
    });
    expect(response).toMatchObject({
      hash: expect.any(String),
    });
  }, 60_000);
});
