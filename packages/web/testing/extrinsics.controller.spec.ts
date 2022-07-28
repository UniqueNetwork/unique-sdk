import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import request from 'supertest';

import { ExtrinsicsController } from '../src/app/modules/substrate/controllers/extrinsics.controller';
import { createApp } from './utils.test';

describe(ExtrinsicsController.name, () => {
  let app: INestApplication;
  let bob: KeyringPair;

  beforeAll(async () => {
    app = await createApp();

    bob = new Keyring({ type: 'sr25519' }).addFromUri('//Bob');
  });

  describe('/extrinsic/build & /extrinsic/submit', () => {
    it('ok', async () => {
      expect(true).toEqual(true);

      const payloadResponse = await request(app.getHttpServer())
        .post(`/api/extrinsic/build`)
        .send({
          address: bob.address,
          section: 'balances',
          method: 'transfer',
          args: [bob.address, 100000000],
        });

      expect(payloadResponse.ok).toBe(true);

      const { signerPayloadJSON, signerPayloadHex } = payloadResponse.body;

      const badSignature = u8aToHex(bob.sign('not_a_payload_hex'));

      const badSubmit = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signatureType: bob.type,
          signature: badSignature,
        });

      expect(badSubmit.status).toEqual(400);
      expect(badSubmit.body.error.code).toEqual(ErrorCodes.BadSignature);

      const correctSignature = u8aToHex(
        bob.sign(hexToU8a(signerPayloadHex), { withType: true }),
      );

      const correctSubmit = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signature: correctSignature,
        });

      expect(correctSubmit.status).toEqual(201);

      const statusResponse = await request(app.getHttpServer())
        .get(`/api/extrinsic/status`)
        .query(correctSubmit.body);

      expect(statusResponse.status).toEqual(200);
    }, 10_000);
  });
});
