import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import { Sdk } from '@unique-nft/sdk';
import { createCollection } from '@unique-nft/sdk/tests/utils/collection-create.test';
import { createRichAccount, TestAccount } from '@unique-nft/sdk/tests';
import { createToken } from '@unique-nft/sdk/tests/utils/token-create.test';

import { createApp } from './utils.test';

describe('Token', () => {
  let app: INestApplication;

  let sdk: Sdk;

  let richAccount: TestAccount;

  beforeAll(async () => {
    app = await createApp();

    sdk = await app.get(Sdk);

    richAccount = createRichAccount();
  });

  describe('GET /api/token', () => {
    it('valid tokenId', async () => {
      const collection = await createCollection(sdk, richAccount);

      const token = await createToken(sdk, collection.id, richAccount);

      const { ok } = await request(app.getHttpServer())
        .get(`/api/token`)
        .query({ collectionId: collection.id, tokenId: token.id });

      expect(ok).toEqual(true);
    }, 60_000);

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
