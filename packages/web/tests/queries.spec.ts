import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { SignatureType } from '@unique-nft/sdk/types';
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
    const { ok } = await request(app.getHttpServer())
      .post(`/api/query`)
      .send(data);
    expect(true).toEqual(ok);
  }

  it('derive.accounts.accountId', async () => {
    await executeQuery({
      endpoint: 'derive',
      module: 'accounts',
      method: 'accountId',
      args: [alice.address],
    });
  });

  it('derive.balances.all', async () => {
    await executeQuery({
      endpoint: 'derive',
      module: 'balances',
      method: 'all',
      args: [alice.address],
    });
  });

  it.each([
    ['derive1', 'balances', 'all', 'Invalid endpoint: "derive1"'],
    ['derive', 'balances1', 'all', 'Invalid module: "balances1"'],
    ['derive', 'balances', 'all1', 'Invalid method: "all1"'],
  ])(
    'invalid query - %s.%s.%s',
    async (
      endpoint: string,
      module: string,
      method: string,
      errorMessage: string,
    ) => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/query`)
        .send({
          endpoint,
          module,
          method,
          args: [],
        });
      expect(false).toEqual(ok);
      expect(body.error.code).toEqual(ErrorCodes.BuildQuery);
      expect(body.error.message).toEqual(errorMessage);
    },
  );

  it.each([
    { endpoint: 'derive', module: 'balances', method: 'all' },
    { endpoint: 'derive', module: 1, method: 'all', args: [] },
    { endpoint: 'derive', module: 'balances', method: 1, args: [] },
  ])('validation fail - %j', async (data: object) => {
    const { ok, body } = await request(app.getHttpServer())
      .post(`/api/query`)
      .send(data);
    expect(false).toEqual(ok);
    expect(body.error.code).toEqual(ErrorCodes.Validation);
  });
});
