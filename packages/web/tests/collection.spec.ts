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

    it.each(['foo', -1, 1.1])(
      'invalid collectionId - %s',
      async (collectionId) => {
        const { ok, body } = await request(app.getHttpServer())
          .get(`/api/collection`)
          .query({ collectionId });
        expect(ok).toEqual(false);
        expect(body.error.code).toEqual(ErrorCodes.Validation);
      },
    );
  });

  describe.skip('POST /api/collection', () => {
    let generatedCollection;
    it('generate collection', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/collection`)
        .send({
          name: 'Sample collection name',
          description: 'sample collection description',
          tokenPrefix: 'TEST',
          address: 'yGDkQ8CbZSsX6y4PaGC5Q7nVtQxycKunSb3W7dHNAJpNYCzUh',
        });
      expect(ok).toEqual(true);
      generatedCollection = body;
    });

    let signResponse;
    it('sign collection', async () => {
      const { signerPayloadHex } = generatedCollection;
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/extrinsic/sign`)
        .set({
          Authorization: 'Seed //Alice',
        })
        .send({
          signerPayloadHex,
        });
      expect(ok).toEqual(true);
      signResponse = body;
    });

    it('submit collection', async () => {
      const { signature } = signResponse;
      const { signerPayloadJSON } = generatedCollection;
      const { ok, body } = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signature,
          signatureType: 'sr25519',
        });
      expect(ok).toEqual(true);
    });
  });
});
