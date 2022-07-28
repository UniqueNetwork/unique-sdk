import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';
import {
  createPoorAccount,
  createRichAccount,
  TestAccount,
} from '@unique-nft/sdk/testing';

import { BalanceController } from '../src/app/modules/substrate/controllers/balance';
import { createApp } from './utils.test';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let richAccount: TestAccount;
  let poorAccount: TestAccount;
  let emptyUser: KeyringPair;

  beforeAll(async () => {
    app = await createApp();

    richAccount = createRichAccount();
    poorAccount = createPoorAccount();

    emptyUser = new Keyring({ type: 'sr25519' }).addFromUri('//EmptyUser');
  });

  function getBalance(address: string): request.Test {
    return request(app.getHttpServer()).get(`/api/balance`).query({ address });
  }

  describe('GET /api/balance', () => {
    it('ok', async () => {
      const response = await getBalance(richAccount.address);

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        availableBalance: expect.any(Object),
        freeBalance: expect.any(Object),
        lockedBalance: expect.any(Object),
      });
    });

    it('not ok', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/balance`)
        .query({ address: 'foo' });

      expect(response.ok).toEqual(false);
    });
  });

  describe('POST /api/balance/transfer', () => {
    it('ok', async () => {
      const transferResult = await request(app.getHttpServer())
        .post(`/api/balance/transfer?use=Result`)
        .set({
          Authorization: `Seed ${richAccount.seed}`,
        })
        .send({
          address: richAccount.address,
          destination: poorAccount.address,
          amount: 0.00001,
        });

      expect(transferResult.ok).toEqual(true);
      expect(transferResult.body).toMatchObject({
        parsed: {
          success: true,
        },
      });
    }, 60_000);

    it('balance too low', async () => {
      const balanceResponse = await getBalance(poorAccount.address);
      const currentAmount = +balanceResponse.body.availableBalance.amount;

      const { body } = await request(app.getHttpServer())
        .post(`/api/balance/transfer?use=Result`)
        .set({
          Authorization: `Seed ${poorAccount.seed}`,
        })
        .send({
          address: poorAccount.address,
          destination: richAccount.address,
          amount: currentAmount + 1,
        });

      expect(body).toMatchObject({
        error: {
          name: 'InsufficientBalance',
          section: 'balances',
          message: 'Balance too low to send value',
        },
        parsed: {
          success: false,
        },
      });
    }, 60_000);

    it.each([-1, 0])('invalid amount: %d', async (amount) => {
      const buildResponse = await request(app.getHttpServer())
        .post(`/api/balance/transfer`)
        .send({
          address: poorAccount.address,
          destination: richAccount.address,
          amount,
        });
      expect(buildResponse.ok).toEqual(false);
      expect(buildResponse.body.error.code).toEqual(ErrorCodes.Validation);
    });

    it('invalid transfer to myself', async () => {
      const buildResponse = await request(app.getHttpServer())
        .post(`/api/balance/transfer`)
        .send({
          address: richAccount.address,
          destination: richAccount.address,
          amount: 1,
        });

      expect(buildResponse.ok).toEqual(false);
      expect(buildResponse.body.error.code).toEqual(ErrorCodes.Validation);
    });
  });
});
