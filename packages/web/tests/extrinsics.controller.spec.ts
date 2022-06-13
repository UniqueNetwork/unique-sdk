import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { ErrorCodes } from '@unique-nft/sdk/errors';
import request from 'supertest';

import { ExtrinsicsController } from '../src/app/controllers';
import { createApp } from './utils.test';

describe(ExtrinsicsController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    app = await createApp();

    alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
  });

  describe('/extrinsic/build & /extrinsic/submit', () => {
    it('ok', async () => {
      expect(true).toEqual(true);

      const payloadResponse = await request(app.getHttpServer())
        .post(`/api/extrinsic/build`)
        .send({
          address: alice.address,
          section: 'balances',
          method: 'transfer',
          args: [alice.address, 100000000],
        });

      expect(payloadResponse.ok).toBe(true);

      const { signerPayloadJSON, signerPayloadHex } = payloadResponse.body;

      const badSignature = u8aToHex(alice.sign('not_a_payload_hex'));

      const badSubmit = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signatureType: alice.type,
          signature: badSignature,
        });

      expect(badSubmit.status).toEqual(400);
      expect(badSubmit.body.ok).toEqual(false);
      expect(badSubmit.body.error.code).toEqual(ErrorCodes.BadSignature);

      const correctSignature = u8aToHex(
        alice.sign(hexToU8a(signerPayloadHex), { withType: true }),
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
