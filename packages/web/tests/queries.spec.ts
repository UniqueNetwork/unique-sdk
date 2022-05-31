import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { QueryControllers, SignatureType } from '@unique-nft/sdk/types';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import request from 'supertest';

import { createApp } from './utils.test';

describe('Web Queries', () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    await cryptoWaitReady();

    app = await createApp();

    alice = new Keyring({ type: SignatureType.Sr25519 }).addFromUri('//Alice');
  });

  async function executeQuery(data: object) {
    const { ok, body } = await request(app.getHttpServer())
      .post(`/api/query`)
      .send(data);
    console.log(expect.getState().currentTestName, ok, body);
    expect(true).toEqual(ok);
  }

  it('derive.accounts.accountId', async () => {
    await executeQuery({
      controller: QueryControllers.derive,
      section: 'accounts',
      method: 'accountId',
      args: [alice.address],
    });
  });

  it('derive.balances.all', async () => {
    await executeQuery({
      controller: QueryControllers.derive,
      section: 'balances',
      method: 'all',
      args: [alice.address],
    });
  });

  it.each([
    ['derive', 'balances1', 'all', 'Invalid section: "balances1"'],
    ['derive', 'balances', 'all1', 'Invalid method: "all1"'],
  ])(
    'invalid query - %s.%s.%s',
    async (
      controller: string,
      section: string,
      method: string,
      errorMessage: string,
    ) => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/query`)
        .send({
          controller,
          section,
          method,
          args: [],
        });
      expect(false).toEqual(ok);
      expect(body.error.code).toEqual(ErrorCodes.BuildQuery);
      expect(body.error.message).toEqual(errorMessage);
    },
  );

  it.each([
    { controller: 'derive', section: 'balances', method: 'all' },
    { controller: '_derive', section: 'balances', method: 'all', args: [] },
    { controller: 'derive', section: 1, method: 'all', args: [] },
    { controller: 'derive', section: 'balances', method: 1, args: [] },
  ])('validation fail - %j', async (data: object) => {
    const { ok, body } = await request(app.getHttpServer())
      .post(`/api/query`)
      .send(data);
    expect(false).toEqual(ok);
    expect(body.error.code).toEqual(ErrorCodes.Validation);
  });
});
