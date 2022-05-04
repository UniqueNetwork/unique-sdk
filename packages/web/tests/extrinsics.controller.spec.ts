import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from '@polkadot/keyring';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex } from '@polkadot/util';
import { ErrorCodes, UnsignedTxPayload } from '@unique-nft/sdk';
import request from 'supertest';

import { ExtrinsicsController } from '../src/app/controllers';
import { AppModule } from '../src/app/app.module';

describe(ExtrinsicsController.name, () => {
  let app: INestApplication;
  let alice: KeyringPair;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await waitReady();

    app = testingModule.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();

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

      const { signerPayloadJSON } = payloadResponse.body as UnsignedTxPayload;

      const badSignature = u8aToHex(
        alice.sign('not_a_payload_hex', {
          withType: true,
        }),
      );

      const badSubmit = await request(app.getHttpServer())
        .post(`/api/extrinsic/submit`)
        .send({
          signerPayloadJSON,
          signature: badSignature,
        });

      expect(badSubmit.status).toEqual(400);
      expect(badSubmit.body.code).toEqual(ErrorCodes.BadSignature);
    });
  });
});
