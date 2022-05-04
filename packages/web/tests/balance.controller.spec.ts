import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import request from 'supertest';

import { BalanceController } from '../src/app/controllers';
import { AppModule } from '../src/app/app.module';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
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
      const response = await request(app.getHttpServer())
        .post(`/api/balance/transfer/build`)
        .query({
          address: 'yGE1aRUaNnQ97C9DzEVgVG2MvDqT3K1KPwzF6dymrLbJrzcCo',
          destination: 'yGE1YdjDSB4PXwPZ6bLFNKr14pw7z6FCvbzLS49voE4C5e7N1',
          amount: 1,
        });
      console.log('response', response.body);
    });
  });
});
