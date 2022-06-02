import { INestApplication } from '@nestjs/common';
import path from 'path';
import request from 'supertest';

import { createApp } from './utils.test';
import { TokenController } from '../src/app/controllers';
import { WebErrorCodes } from '../src/app/errors/codes';

describe(TokenController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('Images upload', () => {
    it('fail - invalid payload', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/images/upload`)
        .send();

      expect(ok).toBe(false);
      expect(body).toMatchObject({
        ok: false,
        error: {
          code: WebErrorCodes.InvalidPayload,
          message: 'Invalid image payload',
        },
      });
    });

    it('fail - invalid filetype', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/images/upload`)
        .attach('file', path.join(__dirname, '..', 'README.md'));

      expect(ok).toBe(false);
      expect(body).toMatchObject({
        ok: false,
        error: {
          code: WebErrorCodes.InvalidFiletype,
          message: 'Invalid filetype',
        },
      });
    });

    it.skip('ok - upload complete', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/images/upload`)
        .attach('file', path.join(__dirname, 'data', 'punk.png'));

      expect(ok).toBe(true);
      expect(body).toMatchObject({
        cid: expect.any(String),
      });
    });
  });
});
