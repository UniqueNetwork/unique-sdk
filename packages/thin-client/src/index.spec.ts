import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { createSigner, SdkSigner } from '@unique-nft/accounts/sign';

import { ThinClient } from './index';
import {
  BalanceTransferBody,
  FeeResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from './types/Api';

const baseUrl = 'http://localhost:3000';

const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

describe('balance', () => {
  let bob: KeyringPair;
  let alice: KeyringPair;
  let signer: SdkSigner;
  let client: ThinClient;

  beforeAll(async () => {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });

    bob = keyring.addFromUri('//Bob');
    alice = keyring.addFromUri('//Alice');

    signer = await createSigner({ seed: '//Bob' });
    client = new ThinClient({ url: baseUrl }, signer);
  });

  it('fee for BalanceTransferBody', async () => {
    const response: FeeResponse = await client.balance.transfer.getFee({
      address: bob.address,
      destination: alice.address,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);

  it('transfer; fee for UnsignedTxPayloadResponse', async () => {
    const response: UnsignedTxPayloadResponse =
      await client.balance.transfer.build({
        address: bob.address,
        destination: alice.address,
        amount: 0.00001,
      });
    expect(response).toEqual(expect.any(Object));
    const feeResponse: FeeResponse = await client.balance.transfer.getFee(
      response,
    );
    expect(feeResponse).toEqual(expect.any(Object));
  }, 60_000);

  it('error getFee', async () => {
    const response: UnsignedTxPayloadResponse =
      await client.balance.transfer.build({
        address: bob.address,
        destination: alice.address,
        amount: 0.00001,
      });
    expect(response).toEqual(expect.any(Object));
    expect(
      client.balance.transfer.getFee({
        ...response,
        signerPayloadHex: '1',
      }),
    ).rejects.toThrowError();
  }, 60_000);

  it('sign; fee for SubmitTxBody', async () => {
    const response: SubmitTxBody = await client.balance.transfer.sign({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
    const feeResponse: FeeResponse = await client.balance.transfer.getFee(
      response,
    );
    expect(feeResponse).toEqual(expect.any(Object));
  }, 60_000);

  it('submitWatch', async () => {
    const response: object = await client.balance.transfer.submitWaitResult({
      address: bobAddress,
      destination: aliceAddress,
      amount: 0.00001,
    });
    expect(response).toEqual(expect.any(Object));
  }, 60_000);
});

it('check balance changes', async () => {
  const signer = await createSigner({ seed: '//Bob' });
  const client = new ThinClient({ url: baseUrl }, signer);
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
