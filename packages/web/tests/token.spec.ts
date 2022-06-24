import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ErrorCodes } from '../../sdk/errors';

import { KeyringPair } from '@polkadot/keyring/types';
import { Sdk } from '../../sdk/src/lib/sdk';
import { getKeyringPairs } from '../../sdk/tests/testing-utils';
import { createCollection } from '../../sdk/tests/utils/collection-create.test';
import { createApp } from './utils.test';
import { TokenController } from '../src/app/modules/unique/controllers/token.controller';

describe(TokenController.name, () => {
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
        const testAccounts = await getKeyringPairs();
        const accountFerdie: KeyringPair = testAccounts.ferdie;
        const sdk = await app.get(Sdk);
        const collection = await createCollection(sdk, accountFerdie);
        const { ok } = await request(app.getHttpServer())
          .post(`/api/token`)
          .send({
            collectionId: collection.id,
            address: accountFerdie.address,
            constData: { ipfsJson: 'aaa', name: 'bbb' },
          });
        expect(ok).toEqual(true);
      }, 120_000);
    });
  });
});
