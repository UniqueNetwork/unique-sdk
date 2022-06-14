import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import '@unique-nft/sdk/extrinsics';
import '@unique-nft/sdk/tokens';
import '@unique-nft/sdk/balance';

import { BalanceController } from '../src/app/controllers';
import { createApp } from './utils.test';

describe(BalanceController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;
  let bob: KeyringPair;
  let emptyUser: KeyringPair;

  beforeAll(async () => {
    app = await createApp();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
    emptyUser = new Keyring({ type: 'sr25519' }).addFromUri('//EmptyUser');
  });

  function getBalance(address: string): request.Test {
    return request(app.getHttpServer()).get(`/api/balance`).query({ address });
  }
  function transferBuild(
    amount: number,
    from: KeyringPair,
    to: KeyringPair,
  ): request.Test {
    return request(app.getHttpServer()).post(`/api/balance/transfer`).send({
      address: from.address,
      destination: to.address,
      amount,
    });
  }
  async function transfer(
    amount: number,
    from: KeyringPair,
    to: KeyringPair,
    seed: string,
  ): Promise<request.Test> {
    const buildResponse = await transferBuild(amount, from, to);
    expect(buildResponse.ok).toEqual(true);
    expect(buildResponse.body).toMatchObject({
      signerPayloadJSON: expect.any(Object),
      signerPayloadHex: expect.any(String),
    });
    const { signerPayloadJSON } = buildResponse.body;

    const signResponse = await request(app.getHttpServer())
      .post(`/api/extrinsic/sign`)
      .set({
        Authorization: `Seed ${seed}`,
      })
      .send(buildResponse.body);
    const { signature } = signResponse.body;

    return request(app.getHttpServer()).post(`/api/extrinsic/submit`).send({
      signature,
      signerPayloadJSON,
    });
  }

  describe('GET /api/balance', () => {
    it('ok', async () => {
      const response = await getBalance(alice.address);

      expect(response.ok).toEqual(true);

      expect(response.body).toMatchObject({
        amount: expect.any(Number),
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
      const submitResponse = await transfer(0.00001, bob, alice, '//Bob');
      expect(submitResponse.ok).toEqual(true);
      expect(submitResponse.body).toMatchObject({
        hash: expect.any(String),
      });
    });

    it('balance too low', async () => {
      const balanceResponse = await getBalance(emptyUser.address);
      const currentAmount = +balanceResponse.body.amount;
      const submitResponse = await transfer(
        currentAmount + 1,
        emptyUser,
        alice,
        '//EmptyUser',
      );

      expect(submitResponse.ok).toEqual(false);

      expect(submitResponse.body.error.code).toEqual(
        ErrorCodes.SubmitExtrinsic,
      );
    });

    it.each([-1, 0])('invalid amount: %d', async (amount) => {
      const buildResponse = await transferBuild(amount, alice, bob);
      expect(buildResponse.ok).toEqual(false);
      expect(buildResponse.body.error.code).toEqual(ErrorCodes.Validation);
    });

    it('invalid transfer to myself', async () => {
      const buildResponse = await transferBuild(1, alice, alice);
      expect(buildResponse.ok).toEqual(false);
      expect(buildResponse.body.error.code).toEqual(ErrorCodes.Validation);
    });
  });
});
