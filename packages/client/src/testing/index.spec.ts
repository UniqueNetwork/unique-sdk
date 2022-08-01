/**
 * @jest-environment node
 */
import { INestApplication } from '@nestjs/common';

import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import '@unique-nft/sdk/state-queries';
import '@unique-nft/sdk/extrinsics';

import { Client } from '../index';
import {
  BalanceTransferParsed,
  ExtrinsicResultResponse,
  FeeResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from '../types';
import {
  createClient,
  createPoorAccount,
  createRichAccount,
  createWeb,
} from './utils.test';

describe('client tests', () => {
  let app: INestApplication;
  let richAccountAddress: string;
  let poorAccountAddress: string;
  let client: Client;
  let clientWithoutSigner: Client;

  beforeAll(async () => {
    if (!app) {
      app = await createWeb();
    }

    client = await createClient(true);
    clientWithoutSigner = await createClient(false);
    richAccountAddress = createRichAccount().address;
    poorAccountAddress = createPoorAccount().address;
  }, 100_000);

  afterAll(() => {
    app.close();
  });

  describe('extrinsics', () => {
    it('build', async () => {
      const response: UnsignedTxPayloadResponse =
        await clientWithoutSigner.extrinsics.build({
          address: richAccountAddress,
          section: 'balances',
          method: 'transfer',
          args: [poorAccountAddress, 1000],
        });
      expect(response).toEqual(expect.any(Object));
    }, 100_000);
  });

  describe('balance', () => {
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

    it('submitWaitResult', async () => {
      const response: ExtrinsicResultResponse<BalanceTransferParsed> =
        await client.balance.transfer.submitWaitResult({
          address: richAccountAddress,
          destination: poorAccountAddress,
          amount: 0.001,
        });
      expect(response).toMatchObject({
        parsed: {
          success: true,
        },
      });
    }, 60_000);
  });

  it('check balance changes', async () => {
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
      await expect(
        clientWithoutSigner.balance.transfer.sign({
          address: richAccountAddress,
          destination: poorAccountAddress,
          amount: 1000,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('submit', () => {
    it('success', async () => {
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
