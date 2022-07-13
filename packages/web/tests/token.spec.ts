import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';

import { Sdk } from '@unique-nft/sdk';
import { createCollection } from '@unique-nft/sdk/tests/utils/collection-create.test';
import { createRichAccount, TestAccount } from '@unique-nft/sdk/tests';
import { createApp } from './utils.test';

describe('Token', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('GET /api/token', () => {
    it('valid tokenId', async () => {
      const { ok } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query({ collectionId: 1, tokenId: 1 });
      expect(ok).toEqual(true);
    });

    it.each([
      {
        collectionId: 'foo',
        tokenId: 1,
      },
      {
        collectionId: 1,
        tokenId: 'foo',
      },
    ])('invalid collectionId or tokenId - %j', async (obj) => {
      const { ok, body } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query(obj);
      expect(ok).toEqual(false);
      expect(body.error.code).toEqual(ErrorCodes.Validation);
    });

    describe('POST /api/token', () => {
      it('generate token', async () => {
        const richAccount: TestAccount = createRichAccount();
        const sdk = await app.get(Sdk);
        const collection = await createCollection(sdk, richAccount);
        const { ok } = await request(app.getHttpServer())
          .post(`/api/token`)
          .send({
            collectionId: collection.id,
            address: richAccount.address,
            constData: { ipfsJson: 'aaa', name: 'bbb' },
          });
        expect(ok).toEqual(true);
      }, 120_000);
    });
  });
});
