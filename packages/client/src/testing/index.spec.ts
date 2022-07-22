/**
 * @jest-environment node
 */
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as process from 'process';
import { INestApplication } from '@nestjs/common';

import { Account, Accounts, SdkSigner } from '@unique-nft/accounts';
import { KeyringAccount, KeyringProvider } from '@unique-nft/accounts/keyring';

import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';

import { Client } from '../index';
import {
  FeeResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from '../types/api';
import { sleep } from '../utils';
import { createWeb } from './utils.test';

const baseUrl = process.env.TEST_WEB_APP_URL || 'http://localhost:3001';

describe('client tests', () => {
  let app: INestApplication;
  let bobAddress: string;
  let aliceAddress: string;
  let signer: SdkSigner;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    const accounts = new Accounts();
    await accounts.addProvider(KeyringProvider);
    const keyringProvider = accounts.getProvider(
      KeyringProvider,
    ) as KeyringProvider;
    const bob = keyringProvider.addSeed('//Bob');
    bobAddress = bob.instance.address;
    const alice = keyringProvider.addSeed('//Alice');
    aliceAddress = alice.instance.address;
    signer = bob.getSigner();
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('extrinsics', () => {
    it('build', async () => {
      const client = new Client({ baseUrl, signer: null });
      const response: UnsignedTxPayloadResponse = await client.extrinsics.build(
        {
          address: bobAddress,
          section: 'balances',
          method: 'transfer',
          args: [aliceAddress, 100000000],
        },
      );
      expect(response).toEqual(expect.any(Object));
    }, 100_000);
  });

  describe('balance', () => {
    let client: Client;

    beforeAll(async () => {
      client = new Client({ baseUrl, signer });
    });

    it('fee for BalanceTransferBody', async () => {
      const response: FeeResponse = await client.balance.transfer.getFee({
        address: bobAddress,
        destination: aliceAddress,
        amount: 100000000,
      });
      expect(response).toEqual(expect.any(Object));
    }, 60_000);

    it('build; fee for UnsignedTxPayloadResponse', async () => {
      const response: UnsignedTxPayloadResponse =
        await client.balance.transfer.build({
          address: bobAddress,
          destination: aliceAddress,
          amount: 100000000,
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
          address: bobAddress,
          destination: aliceAddress,
          amount: 100000000,
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
        amount: 100000000,
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
        amount: 100000000,
      });
      expect(response).toEqual(expect.any(Object));
    }, 60_000);
  });

  it('check balance changes', async () => {
    const client = new Client({ baseUrl, signer });
    await sleep(30_000);
    const initBalanceResponse = await client.balance.get({
      address: bobAddress,
    });
    await sleep(30_000);
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
      const client = new Client({ baseUrl, signer });
      const response = await client.balance.transfer.sign({
        address: bobAddress,
        destination: aliceAddress,
        amount: 100000000,
      });
      expect(response).toMatchObject({
        signerPayloadJSON: expect.any(Object),
        signature: expect.any(String),
      });
    }, 60_000);

    it('error', async () => {
      const client = new Client({ baseUrl, signer: null });
      expect(
        client.balance.transfer.sign({
          address: bobAddress,
          destination: aliceAddress,
          amount: 100000000,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('submit', () => {
    it('success', async () => {
      const client = new Client({ baseUrl, signer });
      const response = await client.balance.transfer.submit({
        address: bobAddress,
        destination: aliceAddress,
        amount: 100000000,
      });
      expect(response).toMatchObject({
        hash: expect.any(String),
      });
    }, 60_000);
  });
});
