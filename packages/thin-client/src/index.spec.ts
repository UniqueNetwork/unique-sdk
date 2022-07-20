import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import * as process from 'process';

import { createSigner, SdkSigner } from '@unique-nft/accounts/sign';

import { INestApplication } from '@nestjs/common';
import { bootstrap } from '@unique-nft/web/src/main';
import { ThinClient } from './index';
import {
  FeeResponse,
  SubmitTxBody,
  UnsignedTxPayloadResponse,
} from './types/api';
import '@unique-nft/sdk/tokens';
import {sleep} from "./utils";

const baseUrl = process.env.URL_FOR_TEST_THIN_CLIENT || 'http://localhost:3000';

const bobAddress = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

describe('thin-client tests', () => {
  let app1: INestApplication;

  beforeAll(async () => {
    await bootstrap();
  }, 200_000);

  describe('extrinsics', () => {
    it('build', async () => {
      try {
        const client = new ThinClient({ baseUrl, signer: null });
        const response: UnsignedTxPayloadResponse =
          await client.extrinsics.build({
            address: 'yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm',
            section: 'balances',
            method: 'transfer',
            args: [
              'yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK',
              100000000,
            ],
          });
        console.log(response);
        expect(response).toEqual(expect.any(Object));
      } catch (e) {
        console.log(e);
      }
    }, 100_000);
  });

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
      client = new ThinClient({ baseUrl, signer });
    });

    it('fee for BalanceTransferBody', async () => {
      const response: FeeResponse = await client.balance.transfer.getFee({
        address: bob.address,
        destination: alice.address,
        amount: 0.00001,
      });
      expect(response).toEqual(expect.any(Object));
    }, 60_000);

    it('build; fee for UnsignedTxPayloadResponse', async () => {
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
    try {
      const signer = await createSigner({ seed: '//Bob' });
      const client = new ThinClient({ baseUrl, signer });
      await sleep(30_000);
      const initBalanceResponse = await client.balance.get({
        address: bobAddress,
      });
      console.log('initBalanceResponse');
      console.log(initBalanceResponse);
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
    } catch (e) {
      console.log(e);
    }
  }, 60_000);

  describe('sign', () => {
    it('success', async () => {
      const signer: SdkSigner = await createSigner({ seed: '//Bob' });
      const client = new ThinClient({ baseUrl, signer });
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
      const client = new ThinClient({ baseUrl, signer: null });
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
      const client = new ThinClient({ baseUrl, signer });
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
});
