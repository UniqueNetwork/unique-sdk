import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';

import { createApp } from './utils.test';

import { TokenController } from '../src/app/controllers';

describe(TokenController.name, () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('GET /api/token', () => {
    it('valid tokenId', async () => {
      const { ok, body } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query({ collectionId: 1, tokenId: 1 });
      expect(ok).toEqual(true);
    });

    it.skip.each([
      {
        collectionId: 'foo',
        tokenId: 1,
      },
      {
        collectionId: 1,
        tokenId: 'foo',
      },
    ])(
      'invalid collectionId - $collectionId or tokenId - $tokenId',
      async (collectionId, tokenId) => {
        const { ok, body } = await request(app.getHttpServer())
          .get(`/api/token`)
          .query({ collectionId, tokenId });
        expect(ok).toEqual(false);
        expect(body.error.code).toEqual(ErrorCodes.Validation);
      },
    );

    describe.skip('POST /api/token', () => {
      let generatedCollection;
      it('generate token', async () => {
        const { ok, body } = await request(app.getHttpServer())
          .post(`/api/token`)
          .send({
            collectionId: 10,
            address: 'yGDkQ8CbZSsX6y4PaGC5Q7nVtQxycKunSb3W7dHNAJpNYCzUh',
            constData: {
              ipfsJson:
                '{"ipfs":"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb","type":"image"}',
              gender: 'Male',
              traits: ['TEETH_SMILE', 'UP_HAIR'],
            },
          });
        expect(ok).toEqual(true);
        generatedCollection = body;
      });
    });
  });
});
