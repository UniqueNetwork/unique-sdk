import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';

import { createApp } from './utils.test';

import { CollectionController } from '../src/app/controllers';

describe(CollectionController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('GET /api/collection', () => {
    it('valid collectionId', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .get(`/api/collection`)
        .query({ collectionId: 1 });
      expect(ok).toEqual(true);
    });

    it.each(['foo', -1, 1.1])('invalid collectionId', async (collectionId) => {
      const { ok, body } = await request(app.getHttpServer())
        .get(`/api/collection`)
        .query({ collectionId });
      expect(ok).toEqual(false);
      expect(body.error.code).toEqual(ErrorCodes.Validation);
    });
  });
});
