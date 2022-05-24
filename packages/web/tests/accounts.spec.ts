import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';

import { createApp, expectAccount } from './utils.test';

describe('Web Accounts', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  it('generate ok', async () => {
    const password = '12345690';
    const { ok, body } = await request(app.getHttpServer())
      .post(`/api/account/generate`)
      .send({
        password,
      });
    expect(true).toEqual(ok);
    expectAccount(body);
  });

  it('get with mnemonic ok', async () => {
    const password = '12345690';
    const mnemonic =
      'say carbon neutral afford cupboard choice company desk forum advance twelve help';
    const { ok, body } = await request(app.getHttpServer())
      .get(`/api/account`)
      .query({
        password,
        mnemonic,
      })
      .send();
    expect(true).toEqual(ok);
    expectAccount(body);
  });

  it.each([
    [undefined, undefined],
    ['pass123', undefined],
    ['pass123', '12345'],
  ])('validation fail - %s/%s', async (password, mnemonic) => {
    const { ok, body } = await request(app.getHttpServer())
      .get(`/api/account`)
      .query({
        password,
        mnemonic,
      })
      .send();
    expect(false).toEqual(ok);
    expect(body.error.code).toEqual(ErrorCodes.Validation);
  });
});
