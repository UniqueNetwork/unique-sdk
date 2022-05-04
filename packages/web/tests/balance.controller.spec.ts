import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import request from 'supertest';

import { BalanceController } from '../src/app/controllers';
import { AppModule } from '../src/app/app.module';
import {u8aToHex} from "@polkadot/util";

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let bob: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  describe('GET /api/balance', () => {
    it('ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: alice.address });

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        amount: expect.any(String),
        formatted: expect.any(String),
      });
    });

    it('not ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: 'foo' });

      expect(response.ok).toEqual(false);
    });
  });

  describe('GET /api/balance/transfer', () => {
    it('ok', async () => {
      const buildResponse = await request(app.getHttpServer())
        .post(`/api/balance/transfer/build`)
        .query({
          address: alice.address,
          destination: bob.address,
          amount: 1,
        });
      console.log('response', buildResponse.body);
      expect(buildResponse.ok).toEqual(true);
      expect(buildResponse.body).toMatchObject({
        signerPayloadJSON: expect.any(Object),
        signerPayloadHex: expect.any(String),
      });

      const { signerPayloadJSON, signerPayloadHex } = buildResponse.body;
      const signatureU8a = alice.sign(signerPayloadHex, {
        withType: true,
      });
      const signature = u8aToHex(signatureU8a);

      const submitResponse = await request(app.getHttpServer())
        .post(`/api/balance/transfer/submit`)
        .query({
          signature,
          signerPayloadJSON,
        });
      console.log('submitResponse', submitResponse.body);
    });
  });
});
