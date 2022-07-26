/**
 * @jest-environment node
 */
import * as process from 'process';
import { INestApplication } from '@nestjs/common';

import { SdkSigner, SignatureType } from '@unique-nft/accounts';
import { KeyringProvider } from '@unique-nft/accounts/keyring';

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
import { createWeb } from './utils.test';

const baseUrl = process.env.TEST_WEB_APP_URL || 'http://localhost:3001';
const TEST_RICH_ACCOUNT = process.env['TEST_RICH_ACCOUNT'] || '//Bob'; // eslint-disable-line
const TEST_POOR_ACCOUNT = process.env['TEST_POOR_ACCOUNT'] || '//Alice'; // eslint-disable-line

describe('client tests', () => {
  let app: INestApplication;
  let richAccountAddress: string;
  let poorAccountAddress: string;
  let signer: SdkSigner;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    const keyringProvider = new KeyringProvider({
      type: SignatureType.Sr25519,
    });
    const richAccount = keyringProvider.addSeed(TEST_RICH_ACCOUNT);
    richAccountAddress = richAccount.instance.address;
    const poorAccount = keyringProvider.addSeed(TEST_POOR_ACCOUNT);
    poorAccountAddress = poorAccount.instance.address;
    signer = richAccount.getSigner();
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('extrinsics', () => {
    it('build', async () => {
      const client = new Client({ baseUrl, signer: null });
      const response: UnsignedTxPayloadResponse = await client.extrinsics.build(
        {
          address: richAccountAddress,
          section: 'balances',
          method: 'transfer',
          args: [poorAccountAddress, 1000],
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
        address: richAccountAddress,
        destination: poorAccountAddress,
        amount: 1000,
      });
      expect(response).toEqual(expect.any(Object));
    }, 60_000);

    it('build; fee for UnsignedTxPayloadResponse', async () => {
      const response: UnsignedTxPayloadResponse =
        await client.balance.transfer.build({
          address: richAccountAddress,
          destination: poorAccountAddress,
          amount: 1000,
        });
      expect(response).toEqual(expect.any(Object));
      const feeResponse: FeeResponse = await client.balance.transfer.getFee(
        response,
      );
      expect(feeResponse).toEqual(expect.any(Object));
    }, 60_000);

    it.skip('error getFee', async () => {
      const response: UnsignedTxPayloadResponse =
        await client.balance.transfer.build({
          address: richAccountAddress,
          destination: poorAccountAddress,
          amount: 1000,
        });
      expect(response).toEqual(expect.any(Object));
      await expect(
        client.balance.transfer.getFee({
          ...response,
          signerPayloadHex: '1',
        }),
      ).rejects.toThrowError();
    }, 60_000);

    it('sign; fee for SubmitTxBody', async () => {
      const response: SubmitTxBody = await client.balance.transfer.sign({
        address: richAccountAddress,
        destination: poorAccountAddress,
        amount: 1000,
      });
      expect(response).toEqual(expect.any(Object));
      const feeResponse: FeeResponse = await client.balance.transfer.getFee(
        response,
      );
      expect(feeResponse).toEqual(expect.any(Object));
    }, 60_000);

    it('submitWatch', async () => {
      const response: object = await client.balance.transfer.submitWaitResult({
        address: richAccountAddress,
        destination: poorAccountAddress,
        amount: 0.001,
      });
      expect(response).toEqual(expect.any(Object));
    }, 60_000);
  });

  it('check balance changes', async () => {
    const client = new Client({ baseUrl, signer });
    const initBalanceResponse = await client.balance.get({
      address: richAccountAddress,
    });
    await client.balance.transfer.submitWaitResult({
      address: richAccountAddress,
      destination: poorAccountAddress,
      amount: 0.001,
    });
    const currentBalanceResponse = await client.balance.get({
      address: richAccountAddress,
    });
    expect(initBalanceResponse.availableBalance.raw).not.toBe(
      currentBalanceResponse.availableBalance.raw,
    );
  }, 60_000);

  describe('sign', () => {
    it('success', async () => {
      const client = new Client({ baseUrl, signer });
      const response = await client.balance.transfer.sign({
        address: richAccountAddress,
        destination: poorAccountAddress,
        amount: 1000,
      });
      expect(response).toMatchObject({
        signerPayloadJSON: expect.any(Object),
        signature: expect.any(String),
      });
    }, 60_000);

    it('error', async () => {
      const client = new Client({ baseUrl, signer: null });
      await expect(
        client.balance.transfer.sign({
          address: richAccountAddress,
          destination: poorAccountAddress,
          amount: 1000,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('submit', () => {
    it('success', async () => {
      const client = new Client({ baseUrl, signer });
      const response = await client.balance.transfer.submit({
        address: richAccountAddress,
        destination: poorAccountAddress,
        amount: 1000,
      });
      expect(response).toMatchObject({
        hash: expect.any(String),
      });
    }, 60_000);
  });
});
